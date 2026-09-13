# 🤖 Directivas Globales para Agentes de IA
### Sistema de Gestión Automatizado LEPA-LEM (Instituto de Zoología Tropical - UCV)

Bienvenido, agente. Estás colaborando en el desarrollo del **Sistema de Gestión Automatizado LEPA-LEM**, una solución Full-Stack moderna para el control de inventario químico, vidriería, bitácora de mantenimiento y préstamos de laboratorio.

> [!IMPORTANT]
> **REGLAS INMUTABLES DEL PROYECTO**
> 1. **Presupuesto Estricto de 100 Horas:** Toda solución debe ser eficiente, sin sobre-ingeniería y enfocada estrictamente en el MVP (Historias de Usuario Core: HU01 a HU10).
> 2. **Type-Safety Absoluto:** TypeScript en modo estricto. Queda terminantemente prohibido el uso de `any` o aserciones inseguras (`as unknown as ...`).
> 3. **Cero DDL Destructivo en Producción:** Toda modificación de base de datos debe redactarse en archivos versionados dentro de `supabase/migrations/` con políticas de Row Level Security (RLS) obligatorias.
> 4. **Adherencia Estética Obligatoria:** La interfaz debe replicar con exactitud el sistema de diseño **Terra Lab** definido en [DESIGN.md](file:///home/miguel-ciavato/Documents/github-repos/sistema-de-gestion-automatizado-izt/DESIGN.md) y los wireframes en [prototype/wireframes_mobile_png/](file:///home/miguel-ciavato/Documents/github-repos/sistema-de-gestion-automatizado-izt/prototype/wireframes_mobile_png).

---

## 🛠️ Stack Tecnológico
* **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS.
* **Backend & Auth:** Supabase (PostgreSQL 15+, Auth, Row Level Security, RPC/Triggers).
* **Testing:** Vitest + `@testing-library/react`.
* **CI/CD:** GitHub Actions + SonarQube Cloud + Vercel Deploy Previews.

---

## 🧭 Skills Especializadas Disponibles
Antes de iniciar tareas complejas, debes consultar y seguir las siguientes skills en `.agent/skills/`:
- **`supabase-safe-migrations`:** [SKILL.md](file:///home/miguel-ciavato/Documents/github-repos/sistema-de-gestion-automatizado-izt/.agent/skills/supabase-safe-migrations/SKILL.md) para diseño de esquemas SQL, RLS y triggers.
- **`terra-lab-design-system`:** [SKILL.md](file:///home/miguel-ciavato/Documents/github-repos/sistema-de-gestion-automatizado-izt/.agent/skills/terra-lab-design-system/SKILL.md) para componentes de React y tokens de estilo.
- **`conventional-commits-and-pr`:** [SKILL.md](file:///home/miguel-ciavato/Documents/github-repos/sistema-de-gestion-automatizado-izt/.agent/skills/conventional-commits-and-pr/SKILL.md) para flujo Git y Conventional Commits.
- **`code-review-excellence`:** [SKILL.md](file:///home/miguel-ciavato/Documents/github-repos/sistema-de-gestion-automatizado-izt/.agent/skills/code-review-skill/SKILL.md) para auditorías de calidad de código.
- **`ask-questions-if-underspecified`:** [SKILL.md](file:///home/miguel-ciavato/Documents/github-repos/sistema-de-gestion-automatizado-izt/.agent/skills/ask-questions-if-underspecified/SKILL.md) si un requerimiento es ambiguo o incompleto.

---

## 📋 Protocolo de Desarrollo por Historia de Usuario (Vertical Slices)
Para cada funcionalidad:
1. **Verificar rama:** Asegurarse de trabajar en una rama `feat/hu<numero>-<descripcion>` desprendida de `main`.
2. **Revisar Requisitos:** Leer el Issue y el archivo correspondiente en [docs/issues/](file:///home/miguel-ciavato/Documents/github-repos/sistema-de-gestion-automatizado-izt/docs/issues).
3. **Revisar Wireframe:** Consultar la pantalla asignada en `prototype/wireframes_mobile_png/`.
4. **Implementar:**
   - Si requiere base de datos: crear migración en `supabase/migrations/` con RLS y actualizar tipos TypeScript.
   - Si requiere UI: usar o extender componentes de `src/components/ui/` respetando [DESIGN.md](file:///home/miguel-ciavato/Documents/github-repos/sistema-de-gestion-automatizado-izt/DESIGN.md).
5. **Verificación Pre-Commit (Quality Checklist):**
   ```bash
   npm run lint        # Debe retornar 0 errores
   npx tsc --noEmit    # Debe compilar sin errores de tipos
   npm run test        # Pruebas unitarias en verde
   ```
6. **Commit:** Redactar mensaje con **Conventional Commits** (ej. `feat(auth): integrate supabase login with lab context`).
