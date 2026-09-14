-- ==============================================================================
-- Migration: 20260913000004_consumo_and_bitacora.sql
-- HU05: Registro de Consumo de Reactivos (Descuento atómico de stock)
-- HU06: Bitácora de Movimientos de Inventario (Auditoría inmutable)
-- ==============================================================================

-- 1. Ajustes a la tabla bitacora_movimientos
ALTER TABLE public.bitacora_movimientos ALTER COLUMN usuario_id DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'bitacora_movimientos' 
      AND column_name = 'nombre_responsable'
  ) THEN
    ALTER TABLE public.bitacora_movimientos ADD COLUMN nombre_responsable VARCHAR(120);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_bitacora_tipo ON public.bitacora_movimientos(tipo_movimiento);

-- 2. Políticas RLS en bitacora_movimientos
-- Solo lectura e inserción; UPDATE y DELETE permanecen estrictamente deshabilitados para garantizar inmutabilidad.
DROP POLICY IF EXISTS "bitacora_select_policy" ON public.bitacora_movimientos;
CREATE POLICY "bitacora_select_policy" ON public.bitacora_movimientos
  FOR SELECT TO authenticated
  USING (
    public.is_admin() OR
    laboratorio_id IN (SELECT id FROM public.laboratorios WHERE activo = true)
  );

DROP POLICY IF EXISTS "bitacora_select_anon_policy" ON public.bitacora_movimientos;
CREATE POLICY "bitacora_select_anon_policy" ON public.bitacora_movimientos
  FOR SELECT TO anon
  USING (true);

DROP POLICY IF EXISTS "bitacora_insert_policy" ON public.bitacora_movimientos;
CREATE POLICY "bitacora_insert_policy" ON public.bitacora_movimientos
  FOR INSERT TO authenticated
  WITH CHECK (
    laboratorio_id IN (SELECT id FROM public.laboratorios WHERE activo = true)
  );

DROP POLICY IF EXISTS "bitacora_insert_anon_policy" ON public.bitacora_movimientos;
CREATE POLICY "bitacora_insert_anon_policy" ON public.bitacora_movimientos
  FOR INSERT TO anon
  WITH CHECK (true);

-- 3. Función RPC atómica para registrar consumo de reactivos (HU05)
CREATE OR REPLACE FUNCTION public.registrar_consumo_reactivo(
  p_reactivo_id UUID,
  p_laboratorio_id UUID,
  p_cantidad NUMERIC,
  p_motivo TEXT DEFAULT NULL,
  p_nombre_responsable TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_stock RECORD;
  v_stock_posterior NUMERIC;
  v_estado VARCHAR(20);
  v_bitacora_id UUID;
  v_usuario_id UUID;
  v_responsable TEXT;
BEGIN
  -- Validar que la cantidad sea estrictamente positiva
  IF p_cantidad IS NULL OR p_cantidad <= 0 THEN
    RAISE EXCEPTION 'La cantidad consumida debe ser estrictamente mayor a cero';
  END IF;

  -- Bloquear fila de stock con FOR UPDATE para garantizar atomicidad y prevenir condiciones de carrera
  SELECT * INTO v_stock
  FROM public.stock_reactivos
  WHERE reactivo_id = p_reactivo_id
    AND laboratorio_id = p_laboratorio_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se encontró stock registrado para este reactivo en el laboratorio seleccionado';
  END IF;

  -- Validar stock suficiente
  IF v_stock.cantidad_actual < p_cantidad THEN
    RAISE EXCEPTION 'Stock insuficiente. Disponible: % %, Solicitado: % %',
      v_stock.cantidad_actual, v_stock.unidad_medida, p_cantidad, v_stock.unidad_medida;
  END IF;

  v_stock_posterior := v_stock.cantidad_actual - p_cantidad;
  IF v_stock_posterior = 0 THEN
    v_estado := 'AGOTADO';
  ELSE
    v_estado := 'DISPONIBLE';
  END IF;

  -- Descontar del stock físico
  UPDATE public.stock_reactivos
  SET
    cantidad_actual = v_stock_posterior,
    estado_fisico = v_estado,
    updated_at = timezone('utc'::text, now())
  WHERE id = v_stock.id;

  -- Determinar nombre del usuario responsable
  v_usuario_id := auth.uid();
  IF p_nombre_responsable IS NOT NULL AND trim(p_nombre_responsable) <> '' THEN
    v_responsable := trim(p_nombre_responsable);
  ELSIF v_usuario_id IS NOT NULL THEN
    SELECT nombre_completo INTO v_responsable
    FROM public.perfiles
    WHERE id = v_usuario_id;
    IF v_responsable IS NULL THEN
      v_responsable := 'Personal de Laboratorio';
    END IF;
  ELSE
    v_responsable := 'Personal de Laboratorio';
  END IF;

  -- Registrar en bitácora inmutable
  INSERT INTO public.bitacora_movimientos (
    laboratorio_id,
    reactivo_id,
    usuario_id,
    nombre_responsable,
    tipo_movimiento,
    cantidad,
    unidad_medida,
    stock_anterior,
    stock_posterior,
    motivo,
    created_at
  ) VALUES (
    p_laboratorio_id,
    p_reactivo_id,
    v_usuario_id,
    v_responsable,
    'CONSUMO',
    p_cantidad,
    v_stock.unidad_medida,
    v_stock.cantidad_actual,
    v_stock_posterior,
    p_motivo,
    timezone('utc'::text, now())
  )
  RETURNING id INTO v_bitacora_id;

  RETURN jsonb_build_object(
    'success', true,
    'bitacora_id', v_bitacora_id,
    'stock_anterior', v_stock.cantidad_actual,
    'stock_posterior', v_stock_posterior,
    'cantidad_consumida', p_cantidad,
    'unidad_medida', v_stock.unidad_medida,
    'estado_fisico', v_estado
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.registrar_consumo_reactivo TO authenticated, anon;

-- 4. Semillas de demostración de bitácora para LEPA
DO $$
DECLARE
  v_lepa_id UUID;
  v_hcl_id UUID;
  v_etoh_id UUID;
BEGIN
  SELECT id INTO v_lepa_id FROM public.laboratorios WHERE codigo = 'LEPA' LIMIT 1;
  SELECT id INTO v_hcl_id FROM public.catalogo_reactivos WHERE codigo_unico = 'RCT-HCL-01' LIMIT 1;
  SELECT id INTO v_etoh_id FROM public.catalogo_reactivos WHERE codigo_unico = 'RCT-ETOH-02' LIMIT 1;

  IF v_lepa_id IS NOT NULL AND v_hcl_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.bitacora_movimientos WHERE reactivo_id = v_hcl_id) THEN
      INSERT INTO public.bitacora_movimientos (
        laboratorio_id, reactivo_id, usuario_id, nombre_responsable,
        tipo_movimiento, cantidad, unidad_medida, stock_anterior, stock_posterior,
        motivo, created_at
      ) VALUES (
        v_lepa_id, v_hcl_id, NULL, 'Dr. Arnaldo Ferrer',
        'INGRESO', 500, 'ml', 0, 500,
        'Adquisición de lote inicial para investigación',
        NOW() - INTERVAL '3 days'
      ),
      (
        v_lepa_id, v_hcl_id, NULL, 'Lic. Elena Morales',
        'CONSUMO', 50, 'ml', 500, 450,
        'Preparación de solución valorada para análisis de aguas',
        NOW() - INTERVAL '1 day'
      );
    END IF;
  END IF;

  IF v_lepa_id IS NOT NULL AND v_etoh_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.bitacora_movimientos WHERE reactivo_id = v_etoh_id) THEN
      INSERT INTO public.bitacora_movimientos (
        laboratorio_id, reactivo_id, usuario_id, nombre_responsable,
        tipo_movimiento, cantidad, unidad_medida, stock_anterior, stock_posterior,
        motivo, created_at
      ) VALUES (
        v_lepa_id, v_etoh_id, NULL, 'Dra. Carmen Rivas',
        'INGRESO', 1000, 'ml', 0, 1000,
        'Lote institucional donado por Decanato de Ciencias',
        NOW() - INTERVAL '5 days'
      ),
      (
        v_lepa_id, v_etoh_id, NULL, 'Tesista Marcos Silva',
        'CONSUMO', 200, 'ml', 1000, 800,
        'Extracción de pigmentos vegetales - Trabajo Especial de Grado',
        NOW() - INTERVAL '2 days'
      );
    END IF;
  END IF;
END $$;
