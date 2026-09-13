---
name: supabase-safe-migrations
description: Directrices estrictas para diseñar esquemas, migraciones SQL inmutables, políticas de seguridad RLS y funciones en Supabase / PostgreSQL.
---

# Supabase Safe Migrations & Database Security

## Cuándo usar esta skill
Usa esta skill cada vez que un requerimiento involucre:
- Crear o modificar tablas, columnas, índices o restricciones en la base de datos.
- Escribir o auditar políticas de Row Level Security (RLS).
- Crear funciones almacenadas (RPC), triggers de base de datos o secuencias.
- Generar o actualizar tipos estáticos de TypeScript desde Supabase.

## Principios Fundamentales

### 1. Inmutabilidad y Versionado Estricto
- **PROHIBIDO:** Ejecutar sentencias DDL directamente contra la base de datos de producción mediante herramientas ad-hoc sin respaldo en código.
- Toda alteración debe residir en un archivo `.sql` dentro de `supabase/migrations/` con prefijo secuencial timestamp (ej. `20260913000001_tablas_maestras.sql`).
- Una migración ya aplicada y versionada **nunca se edita**; los cambios futuros se realizan en una nueva migración.

### 2. Idempotencia y Resiliencia
- Usar siempre `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, `DO $$ BEGIN ... END $$;` para enums y verificaciones de existencia.
- Cada clave foránea debe tener un índice explícito para optimizar consultas de unión (JOINs) y cascadas.
- Usar tipos nativos óptimos: `TIMESTAMPTZ` para marcas de tiempo, `UUID` para identificadores primarios (`gen_random_uuid()`), `NUMERIC` para montos o medidas continuas.

### 3. Row Level Security (RLS) Obligatorio
Por cada tabla creada:
```sql
ALTER TABLE public.nombre_tabla ENABLE ROW LEVEL SECURITY;
```
- Ninguna tabla operativa debe quedar sin RLS activo.
- Las políticas deben verificar el laboratorio activo asignado al usuario autenticado (`auth.uid()`) o privilegios de administrador.
- Separar explícitamente políticas para `SELECT`, `INSERT`, `UPDATE` y `DELETE`.

### 4. Automatización de Tipos TypeScript
Tras redactar o aplicar migraciones:
- Ejecutar:
  ```bash
  npx supabase gen types typescript --local > src/types/database.types.ts
  ```
- Importar `Database` desde `src/types/database.types.ts` en todo cliente de Supabase para tener 100% de inferencia estática sin castings manuales (`as any`).

## Reglas para el Sistema LEPA-LEM
- Las existencias físicas (`stock_reactivo`, `inventario_vidrio`, `inventario_miscelaneos`) deben estar estrictamente referenciadas a `laboratorio_id`.
- Los catálogos institucionales (`catalogo_reactivos`) son de lectura compartida para ambos laboratorios, pero de edición restringida a roles autorizados.
- La tabla `bitacora_movimientos` debe ser inmutable: solo permitir inserciones (`INSERT`), bloqueando actualizaciones (`UPDATE`) y borrados (`DELETE`) para garantizar la fidelidad de auditorías.
