-- ==============================================================================
-- Migration: 20260913000003_stock_and_alertas.sql
-- HU04: Registro de Stock Físico por Laboratorio
-- HU07: Alertas Visuales de Stock Mínimo (0 < stock <= umbral)
-- ==============================================================================

-- 1. Restricción de unicidad: un reactivo tiene un único registro de stock por laboratorio
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_stock_reactivo_laboratorio'
  ) THEN
    ALTER TABLE public.stock_reactivos
      ADD CONSTRAINT uq_stock_reactivo_laboratorio UNIQUE (reactivo_id, laboratorio_id);
  END IF;
END $$;

-- 2. Trigger para sincronizar automáticamente 'es_uso_comun' en stock_reactivos
-- según el catálogo institucional (HU04 Criterio 5)
CREATE OR REPLACE FUNCTION public.sync_stock_uso_comun()
RETURNS TRIGGER AS $$
BEGIN
  SELECT es_uso_comun INTO NEW.es_uso_comun
  FROM public.catalogo_reactivos
  WHERE id = NEW.reactivo_id;

  IF NEW.es_uso_comun IS NULL THEN
    NEW.es_uso_comun := FALSE;
  END IF;

  -- Actualizar estado_fisico automáticamente según cantidad_actual
  IF NEW.cantidad_actual = 0 THEN
    NEW.estado_fisico := 'AGOTADO';
  ELSIF NEW.estado_fisico = 'AGOTADO' AND NEW.cantidad_actual > 0 THEN
    NEW.estado_fisico := 'DISPONIBLE';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_stock_uso_comun ON public.stock_reactivos;
CREATE TRIGGER trg_sync_stock_uso_comun
  BEFORE INSERT OR UPDATE ON public.stock_reactivos
  FOR EACH ROW EXECUTE FUNCTION public.sync_stock_uso_comun();

-- 3. Políticas RLS adicionales para gestión de stock
DO $$
BEGIN
  -- Permitir a usuarios autenticados insertar o actualizar stock para cualquier laboratorio válido
  -- (cuando operan en LEPA o LEM según contexto de sede)
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'stock_insert_policy' AND tablename = 'stock_reactivos') THEN
    DROP POLICY "stock_insert_policy" ON public.stock_reactivos;
  END IF;
  
  CREATE POLICY "stock_insert_policy" ON public.stock_reactivos
    FOR INSERT TO authenticated WITH CHECK (
      laboratorio_id IN (SELECT id FROM public.laboratorios WHERE activo = true)
    );

  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'stock_update_policy' AND tablename = 'stock_reactivos') THEN
    DROP POLICY "stock_update_policy" ON public.stock_reactivos;
  END IF;

  CREATE POLICY "stock_update_policy" ON public.stock_reactivos
    FOR UPDATE TO authenticated USING (
      laboratorio_id IN (SELECT id FROM public.laboratorios WHERE activo = true)
    );

  -- Política anónima para permitir pruebas locales / modo invitado si aplica
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'stock_insert_anon_policy' AND tablename = 'stock_reactivos') THEN
    CREATE POLICY "stock_insert_anon_policy" ON public.stock_reactivos
      FOR INSERT TO anon WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'stock_update_anon_policy' AND tablename = 'stock_reactivos') THEN
    CREATE POLICY "stock_update_anon_policy" ON public.stock_reactivos
      FOR UPDATE TO anon USING (true);
  END IF;
END $$;

-- 4. Semilla de caso de prueba para HU07 (Reactivo con stock = 0 en LEPA para probar "Sin existencia")
DO $$
DECLARE
  v_lepa_id UUID;
  v_naoh_id UUID;
BEGIN
  SELECT id INTO v_lepa_id FROM public.laboratorios WHERE codigo = 'LEPA' LIMIT 1;
  SELECT id INTO v_naoh_id FROM public.catalogo_reactivos WHERE codigo_unico = 'RCT-NAOH-03' LIMIT 1;

  IF v_lepa_id IS NOT NULL AND v_naoh_id IS NOT NULL THEN
    INSERT INTO public.stock_reactivos (
      reactivo_id,
      laboratorio_id,
      cantidad_actual,
      unidad_medida,
      ubicacion_fisica,
      umbral_minimo,
      fecha_vencimiento,
      lote,
      ultimo_precio_adquirido,
      moneda_precio,
      estado_fisico
    ) VALUES (
      v_naoh_id,
      v_lepa_id,
      0,
      'g',
      'Estante de Bases - LEPA',
      250,
      '2029-01-15',
      'L-NAOH-LEPA-01',
      18.00,
      'USD',
      'AGOTADO'
    )
    ON CONFLICT (reactivo_id, laboratorio_id) DO UPDATE
    SET cantidad_actual = 0,
        estado_fisico = 'AGOTADO';
  END IF;
END $$;
