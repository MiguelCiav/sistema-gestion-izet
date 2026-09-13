---
name: conventional-commits-and-pr
description: Protocolo estricto para la creación de ramas, mensajes de commit bajo Conventional Commits y Pull Requests vinculados a Issues en GitHub.
---

# Conventional Commits & Pull Request Protocol

## Cuándo usar esta skill
Usa esta skill cada vez que:
- Creas una nueva rama de funcionalidad o corrección.
- Redactas mensajes de confirmación (`git commit`).
- Preparas o creas una Pull Request en GitHub.
- Verificas que tu código cumpla con los estándares de calidad antes de enviar cambios.

## 1. Nomenclatura de Ramas (GitHub Flow)
Las ramas se desprenden siempre de `main` actualizado:
- Funcionalidades: `feat/hu<numero>-<descripcion-corta>` (ej. `feat/hu01-auth-supabase`).
- Correcciones: `fix/<descripcion-corta>` (ej. `fix/alerta-stock-cero`).
- Configuración/Infra: `chore/<descripcion-corta>` (ej. `chore/ci-sonarcloud`).
- Documentación: `docs/<descripcion-corta>` (ej. `docs/api-specs`).

## 2. Convención de Commits (Conventional Commits v1.0.0)
Formato general:
```text
<tipo>(<alcance>): <descripción corta en minúsculas y presente>

[cuerpo opcional detallando motivación o cambios no obvios]

[pie opcional referenciando issues]
```

### Tipos Permitidos
- `feat`: Nueva característica para el usuario final (ej. `feat(auth): add supabase session listener`).
- `fix`: Corrección de un error (ej. `fix(stock): prevent negative consumption amounts`).
- `test`: Adición o refactorización de pruebas unitarias o de integración.
- `refactor`: Cambio de código que no añade funcionalidad ni corrige errores.
- `chore`: Tareas de mantenimiento, dependencias o configuración de herramientas.
- `docs`: Cambios exclusivos en documentación.
- `ci`: Modificaciones en pipelines de CI/CD (GitHub Actions, SonarCloud).

### Alcances Sugeridos (`scope`)
`auth`, `catalogo`, `stock`, `prestamos`, `vidrio`, `equipos`, `reportes`, `ui`, `db`, `ci`.

## 3. Checklist de Calidad Pre-Commit Obligatorio
Antes de hacer commit y push, el agente **debe ejecutar y verificar**:
1. `npm run lint` -> 0 errores.
2. `npx tsc --noEmit` -> 0 errores de tipado.
3. `npm run test` -> 100% de pruebas pasando.

## 4. Estructura de Pull Request
Toda PR debe crearse vinculando el Issue correspondiente:
```markdown
## 📌 Descripción
Breve explicación de los cambios implementados y motivación técnica.

## 🔗 Issues Vinculados
Closes #<numero_issue>

## 🧪 Pruebas Realizadas
- [x] Pruebas unitarias ejecutadas con Vitest.
- [x] Verificación de tipos TypeScript (`tsc --noEmit`).
- [x] Validación visual responsive acorde a wireframe correspondiente.

## 📸 Evidencia Visual
(Capturas de pantalla o previews de Vercel si aplica)
```
