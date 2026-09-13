-- ==============================================================================
-- Migration: 20260913000002_add_uso_comun_and_read_policies.sql
-- HU02 & HU03: Soporte para 'Insumo de Uso Común' en catálogo y políticas de lectura pública/invitados
-- ==============================================================================

-- 1. Agregar es_uso_comun a catalogo_reactivos si no existe (HU03 Criterio 3)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'catalogo_reactivos' 
      AND column_name = 'es_uso_comun'
  ) THEN
    ALTER TABLE public.catalogo_reactivos 
    ADD COLUMN es_uso_comun BOOLEAN DEFAULT FALSE NOT NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_catalogo_uso_comun ON public.catalogo_reactivos(es_uso_comun);

-- 2. Políticas de lectura pública/anon para permitir acceso en modo invitado
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'laboratorios_select_anon_policy' AND tablename = 'laboratorios'
  ) THEN
    CREATE POLICY "laboratorios_select_anon_policy" ON public.laboratorios
      FOR SELECT TO anon USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'catalogo_select_anon_policy' AND tablename = 'catalogo_reactivos'
  ) THEN
    CREATE POLICY "catalogo_select_anon_policy" ON public.catalogo_reactivos
      FOR SELECT TO anon USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'stock_select_anon_policy' AND tablename = 'stock_reactivos'
  ) THEN
    CREATE POLICY "stock_select_anon_policy" ON public.stock_reactivos
      FOR SELECT TO anon USING (true);
  END IF;
END $$;

-- 3. Semillas iniciales de reactivos estándar para LEPA y LEM (idempotente)
INSERT INTO public.catalogo_reactivos (
  codigo_unico,
  nombre,
  formula_quimica,
  clasificacion_riesgo,
  nfpa_salud,
  nfpa_inflamabilidad,
  nfpa_inestabilidad,
  nfpa_especial,
  es_regulado,
  entidades_regulatorias,
  es_uso_comun,
  ultimo_precio,
  moneda_precio,
  fecha_ultimo_precio,
  activo
) VALUES 
(
  'RCT-HCL-01',
  'Ácido Clorhídrico 37%',
  'HCl',
  'Corrosivo',
  3,
  0,
  1,
  null,
  true,
  ARRAY['RESQUIMIC', 'CICPC']::TEXT[],
  true,
  45.00,
  'USD',
  '2026-08-15',
  true
),
(
  'RCT-ETOH-02',
  'Etanol Absoluto 99.8%',
  'C2H5OH',
  'Inflamable',
  2,
  3,
  0,
  null,
  false,
  '{}'::TEXT[],
  true,
  28.50,
  'USD',
  '2026-08-20',
  true
),
(
  'RCT-NAOH-03',
  'Hidróxido de Sodio (Lentejas)',
  'NaOH',
  'Corrosivo / Alcalino',
  3,
  0,
  1,
  null,
  false,
  '{}'::TEXT[],
  false,
  18.00,
  'USD',
  '2026-09-01',
  true
),
(
  'RCT-ACT-04',
  'Acetona Grado Analítico',
  'CH3COCH3',
  'Inflamable / Irritante',
  1,
  3,
  0,
  null,
  true,
  ARRAY['RESQUIMIC']::TEXT[],
  true,
  32.00,
  'USD',
  '2026-08-10',
  true
)
ON CONFLICT (codigo_unico) DO NOTHING;

-- 4. Semillas de stock físico en LEPA y LEM para los reactivos creados
DO $$
DECLARE
  v_lepa_id UUID;
  v_lem_id UUID;
  v_rct_hcl UUID;
  v_rct_etoh UUID;
  v_rct_naoh UUID;
  v_rct_act UUID;
BEGIN
  SELECT id INTO v_lepa_id FROM public.laboratorios WHERE codigo = 'LEPA' LIMIT 1;
  SELECT id INTO v_lem_id FROM public.laboratorios WHERE codigo = 'LEM' LIMIT 1;

  SELECT id INTO v_rct_hcl FROM public.catalogo_reactivos WHERE codigo_unico = 'RCT-HCL-01' LIMIT 1;
  SELECT id INTO v_rct_etoh FROM public.catalogo_reactivos WHERE codigo_unico = 'RCT-ETOH-02' LIMIT 1;
  SELECT id INTO v_rct_naoh FROM public.catalogo_reactivos WHERE codigo_unico = 'RCT-NAOH-03' LIMIT 1;
  SELECT id INTO v_rct_act FROM public.catalogo_reactivos WHERE codigo_unico = 'RCT-ACT-04' LIMIT 1;

  IF v_lepa_id IS NOT NULL AND v_rct_hcl IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.stock_reactivos WHERE reactivo_id = v_rct_hcl AND laboratorio_id = v_lepa_id) THEN
      INSERT INTO public.stock_reactivos (reactivo_id, laboratorio_id, cantidad_actual, unidad_medida, ubicacion_fisica, umbral_minimo, fecha_vencimiento, lote, ultimo_precio_adquirido, moneda_precio, es_uso_comun, estado_fisico)
      VALUES (v_rct_hcl, v_lepa_id, 1500, 'ml', 'Gabinete de Ácidos 1 - Estante A', 500, '2027-12-31', 'L-HCL-2026-A', 45.00, 'USD', true, 'DISPONIBLE');
    END IF;
  END IF;

  IF v_lepa_id IS NOT NULL AND v_rct_etoh IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.stock_reactivos WHERE reactivo_id = v_rct_etoh AND laboratorio_id = v_lepa_id) THEN
      INSERT INTO public.stock_reactivos (reactivo_id, laboratorio_id, cantidad_actual, unidad_medida, ubicacion_fisica, umbral_minimo, fecha_vencimiento, lote, ultimo_precio_adquirido, moneda_precio, es_uso_comun, estado_fisico)
      VALUES (v_rct_etoh, v_lepa_id, 2500, 'ml', 'Gabinete de Inflamables 2', 1000, '2028-06-30', 'L-ETOH-2026-B', 28.50, 'USD', true, 'DISPONIBLE');
    END IF;
  END IF;

  IF v_lem_id IS NOT NULL AND v_rct_etoh IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.stock_reactivos WHERE reactivo_id = v_rct_etoh AND laboratorio_id = v_lem_id) THEN
      INSERT INTO public.stock_reactivos (reactivo_id, laboratorio_id, cantidad_actual, unidad_medida, ubicacion_fisica, umbral_minimo, fecha_vencimiento, lote, ultimo_precio_adquirido, moneda_precio, es_uso_comun, estado_fisico)
      VALUES (v_rct_etoh, v_lem_id, 1000, 'ml', 'Gabinete Reactivos LEM - Repisa 3', 500, '2028-06-30', 'L-ETOH-2026-B', 28.50, 'USD', true, 'DISPONIBLE');
    END IF;
  END IF;

  IF v_lem_id IS NOT NULL AND v_rct_naoh IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.stock_reactivos WHERE reactivo_id = v_rct_naoh AND laboratorio_id = v_lem_id) THEN
      INSERT INTO public.stock_reactivos (reactivo_id, laboratorio_id, cantidad_actual, unidad_medida, ubicacion_fisica, umbral_minimo, fecha_vencimiento, lote, ultimo_precio_adquirido, moneda_precio, es_uso_comun, estado_fisico)
      VALUES (v_rct_naoh, v_lem_id, 800, 'g', 'Estante de Bases - LEM', 250, '2029-01-15', 'L-NAOH-2026', 18.00, 'USD', false, 'DISPONIBLE');
    END IF;
  END IF;

  IF v_lepa_id IS NOT NULL AND v_rct_act IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.stock_reactivos WHERE reactivo_id = v_rct_act AND laboratorio_id = v_lepa_id) THEN
      INSERT INTO public.stock_reactivos (reactivo_id, laboratorio_id, cantidad_actual, unidad_medida, ubicacion_fisica, umbral_minimo, fecha_vencimiento, lote, ultimo_precio_adquirido, moneda_precio, es_uso_comun, estado_fisico)
      VALUES (v_rct_act, v_lepa_id, 500, 'ml', 'Gabinete de Inflamables 1', 500, '2027-10-20', 'L-ACT-2026-X', 32.00, 'USD', true, 'DISPONIBLE');
    END IF;
  END IF;
END $$;
