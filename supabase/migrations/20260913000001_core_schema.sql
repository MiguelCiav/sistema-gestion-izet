-- ==============================================================================
-- Migración 20260913000001_core_schema.sql
-- Sistema de Gestión Automatizado LEPA-LEM (IZT - UCV)
-- Esquema base: Laboratorios, Perfiles, Catálogo de Reactivos, Stock, Bitácora y Préstamos
-- ==============================================================================

-- 1. Habilitar extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Función genérica para actualización de timestamp (updated_at)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Tabla: laboratorios (Aislamiento de sedes LEPA y LEM)
CREATE TABLE IF NOT EXISTS public.laboratorios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(20) UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Semilla inicial de laboratorios
INSERT INTO public.laboratorios (codigo, nombre, descripcion)
VALUES 
  ('LEPA', 'Laboratorio de Ecología de Poblaciones de Artrópodos', 'Laboratorio IZT - UCV'),
  ('LEM', 'Laboratorio de Entomología Médica', 'Laboratorio IZT - UCV')
ON CONFLICT (codigo) DO NOTHING;

-- 4. Tabla: perfiles (Extensión de auth.users con contexto y roles)
CREATE TABLE IF NOT EXISTS public.perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nombre_completo TEXT NOT NULL,
  rol VARCHAR(30) NOT NULL DEFAULT 'analista' CHECK (rol IN ('admin', 'analista', 'investigador', 'invitado')),
  laboratorio_id UUID REFERENCES public.laboratorios(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_perfiles_lab ON public.perfiles(laboratorio_id);

-- 5. Funciones auxiliares de seguridad para RLS
CREATE OR REPLACE FUNCTION public.get_auth_user_lab_id()
RETURNS UUID AS $$
  SELECT laboratorio_id FROM public.perfiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perfiles
    WHERE id = auth.uid() AND rol = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 6. Trigger automático para sincronizar nuevos usuarios registrados en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfiles (id, email, nombre_completo, rol, laboratorio_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre_completo', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'rol', 'analista'),
    (SELECT id FROM public.laboratorios WHERE codigo = COALESCE(NEW.raw_user_meta_data->>'laboratorio_codigo', 'LEPA') LIMIT 1)
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      nombre_completo = EXCLUDED.nombre_completo,
      updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Tabla: catalogo_reactivos (Catálogo institucional centralizado)
CREATE TABLE IF NOT EXISTS public.catalogo_reactivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_unico VARCHAR(50) UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  formula_quimica TEXT,
  clasificacion_riesgo TEXT NOT NULL,
  nfpa_salud SMALLINT DEFAULT 0 CHECK (nfpa_salud BETWEEN 0 AND 4) NOT NULL,
  nfpa_inflamabilidad SMALLINT DEFAULT 0 CHECK (nfpa_inflamabilidad BETWEEN 0 AND 4) NOT NULL,
  nfpa_inestabilidad SMALLINT DEFAULT 0 CHECK (nfpa_inestabilidad BETWEEN 0 AND 4) NOT NULL,
  nfpa_especial VARCHAR(10),
  es_regulado BOOLEAN DEFAULT FALSE NOT NULL,
  entidades_regulatorias TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  ultimo_precio NUMERIC(12,2),
  moneda_precio VARCHAR(3) DEFAULT 'USD' CHECK (moneda_precio IN ('USD', 'VES')),
  fecha_ultimo_precio DATE,
  activo BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_catalogo_codigo ON public.catalogo_reactivos(codigo_unico);
CREATE INDEX IF NOT EXISTS idx_catalogo_regulado ON public.catalogo_reactivos(es_regulado);

-- 8. Tabla: stock_reactivos (Existencia física por laboratorio)
CREATE TABLE IF NOT EXISTS public.stock_reactivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reactivo_id UUID NOT NULL REFERENCES public.catalogo_reactivos(id) ON DELETE RESTRICT,
  laboratorio_id UUID NOT NULL REFERENCES public.laboratorios(id) ON DELETE CASCADE,
  cantidad_actual NUMERIC(12,3) NOT NULL DEFAULT 0 CHECK (cantidad_actual >= 0),
  unidad_medida VARCHAR(20) NOT NULL,
  ubicacion_fisica TEXT NOT NULL,
  umbral_minimo NUMERIC(12,3) NOT NULL DEFAULT 0 CHECK (umbral_minimo >= 0),
  fecha_vencimiento DATE,
  lote TEXT,
  ultimo_precio_adquirido NUMERIC(12,2),
  moneda_precio VARCHAR(3) DEFAULT 'USD' CHECK (moneda_precio IN ('USD', 'VES')),
  es_uso_comun BOOLEAN DEFAULT FALSE NOT NULL,
  estado_fisico VARCHAR(20) DEFAULT 'DISPONIBLE' CHECK (estado_fisico IN ('DISPONIBLE', 'EN_PRESTAMO', 'AGOTADO')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_stock_lab ON public.stock_reactivos(laboratorio_id);
CREATE INDEX IF NOT EXISTS idx_stock_reactivo ON public.stock_reactivos(reactivo_id);
CREATE INDEX IF NOT EXISTS idx_stock_caducidad ON public.stock_reactivos(fecha_vencimiento);

-- 9. Tabla: bitacora_movimientos (Historial inmutable de auditoría)
CREATE TABLE IF NOT EXISTS public.bitacora_movimientos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  laboratorio_id UUID NOT NULL REFERENCES public.laboratorios(id) ON DELETE RESTRICT,
  reactivo_id UUID NOT NULL REFERENCES public.catalogo_reactivos(id) ON DELETE RESTRICT,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  tipo_movimiento VARCHAR(30) NOT NULL CHECK (tipo_movimiento IN ('CONSUMO', 'INGRESO', 'AJUSTE', 'PRESTAMO_SALIDA', 'PRESTAMO_RETORNO', 'BAJA')),
  cantidad NUMERIC(12,3) NOT NULL,
  unidad_medida VARCHAR(20) NOT NULL,
  stock_anterior NUMERIC(12,3) NOT NULL,
  stock_posterior NUMERIC(12,3) NOT NULL,
  motivo TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bitacora_lab ON public.bitacora_movimientos(laboratorio_id);
CREATE INDEX IF NOT EXISTS idx_bitacora_fecha ON public.bitacora_movimientos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bitacora_reactivo ON public.bitacora_movimientos(reactivo_id);

-- 10. Tabla: prestamos (Préstamos generales a cualquier solicitante)
CREATE TABLE IF NOT EXISTS public.prestamos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  laboratorio_origen_id UUID NOT NULL REFERENCES public.laboratorios(id) ON DELETE RESTRICT,
  reactivo_id UUID NOT NULL REFERENCES public.catalogo_reactivos(id) ON DELETE RESTRICT,
  solicitante_nombre TEXT NOT NULL,
  solicitante_cedula TEXT NOT NULL,
  solicitante_institucion TEXT NOT NULL,
  solicitante_contacto TEXT,
  tipo_prestamo VARCHAR(20) NOT NULL CHECK (tipo_prestamo IN ('FRASCO_COMPLETO', 'FRACCION')),
  cantidad_prestada NUMERIC(12,3) NOT NULL CHECK (cantidad_prestada > 0),
  unidad_medida VARCHAR(20) NOT NULL,
  fecha_prestamo TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  fecha_estimada_devolucion DATE NOT NULL,
  fecha_devolucion_real TIMESTAMPTZ,
  estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'DEVUELTO', 'DEVUELTO_PARCIAL', 'EXTRAVIADO', 'CONSUMIDO_TOTAL')),
  observaciones TEXT,
  usuario_registro_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prestamos_lab ON public.prestamos(laboratorio_origen_id);
CREATE INDEX IF NOT EXISTS idx_prestamos_estado ON public.prestamos(estado);

-- 11. Triggers para actualizar updated_at automáticamente
CREATE OR REPLACE TRIGGER trg_laboratorios_updated_at
  BEFORE UPDATE ON public.laboratorios
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_perfiles_updated_at
  BEFORE UPDATE ON public.perfiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_catalogo_updated_at
  BEFORE UPDATE ON public.catalogo_reactivos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_stock_updated_at
  BEFORE UPDATE ON public.stock_reactivos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_prestamos_updated_at
  BEFORE UPDATE ON public.prestamos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 12. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- ==============================================================================

-- Habilitar RLS en todas las tablas operativas
ALTER TABLE public.laboratorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogo_reactivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_reactivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bitacora_movimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestamos ENABLE ROW LEVEL SECURITY;

-- Políticas: laboratorios
CREATE POLICY "laboratorios_select_policy" ON public.laboratorios
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "laboratorios_admin_all_policy" ON public.laboratorios
  FOR ALL TO authenticated USING (public.is_admin());

-- Políticas: perfiles
CREATE POLICY "perfiles_select_policy" ON public.perfiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "perfiles_update_policy" ON public.perfiles
  FOR UPDATE TO authenticated USING (id = auth.uid() OR public.is_admin());

-- Políticas: catalogo_reactivos (Lectura global, inserción/edición para autenticados)
CREATE POLICY "catalogo_select_policy" ON public.catalogo_reactivos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "catalogo_insert_policy" ON public.catalogo_reactivos
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "catalogo_update_policy" ON public.catalogo_reactivos
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "catalogo_delete_policy" ON public.catalogo_reactivos
  FOR DELETE TO authenticated USING (public.is_admin());

-- Políticas: stock_reactivos (Aislamiento por laboratorio y uso común)
CREATE POLICY "stock_select_policy" ON public.stock_reactivos
  FOR SELECT TO authenticated USING (
    laboratorio_id = public.get_auth_user_lab_id()
    OR es_uso_comun = TRUE
    OR public.is_admin()
  );

CREATE POLICY "stock_insert_policy" ON public.stock_reactivos
  FOR INSERT TO authenticated WITH CHECK (
    laboratorio_id = public.get_auth_user_lab_id()
    OR public.is_admin()
  );

CREATE POLICY "stock_update_policy" ON public.stock_reactivos
  FOR UPDATE TO authenticated USING (
    laboratorio_id = public.get_auth_user_lab_id()
    OR public.is_admin()
  );

CREATE POLICY "stock_delete_policy" ON public.stock_reactivos
  FOR DELETE TO authenticated USING (public.is_admin());

-- Políticas: bitacora_movimientos (Solo lectura e inserción, inmutable)
CREATE POLICY "bitacora_select_policy" ON public.bitacora_movimientos
  FOR SELECT TO authenticated USING (
    laboratorio_id = public.get_auth_user_lab_id()
    OR public.is_admin()
  );

CREATE POLICY "bitacora_insert_policy" ON public.bitacora_movimientos
  FOR INSERT TO authenticated WITH CHECK (
    usuario_id = auth.uid()
    AND (laboratorio_id = public.get_auth_user_lab_id() OR public.is_admin())
  );

-- Políticas: prestamos (Gestionados por el laboratorio emisor)
CREATE POLICY "prestamos_select_policy" ON public.prestamos
  FOR SELECT TO authenticated USING (
    laboratorio_origen_id = public.get_auth_user_lab_id()
    OR public.is_admin()
  );

CREATE POLICY "prestamos_insert_policy" ON public.prestamos
  FOR INSERT TO authenticated WITH CHECK (
    usuario_registro_id = auth.uid()
    AND (laboratorio_origen_id = public.get_auth_user_lab_id() OR public.is_admin())
  );

CREATE POLICY "prestamos_update_policy" ON public.prestamos
  FOR UPDATE TO authenticated USING (
    laboratorio_origen_id = public.get_auth_user_lab_id()
    OR public.is_admin()
  );

CREATE POLICY "prestamos_delete_policy" ON public.prestamos
  FOR DELETE TO authenticated USING (public.is_admin());
