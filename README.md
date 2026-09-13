# 🌿 Sistema de Gestión Automatizada IZT
### Instituto de Zoología Tropical - Universidad Central de Venezuela (UCV)

Solución tecnológica moderna, Full-Stack y multiplataforma diseñada como un Producto Mínimo Viable (MVP) de alta precisión para optimizar la gestión operativa de los laboratorios **LEPA** (Laboratorio de Ecología de Poblaciones de Artrópodos) y **LEM** (Laboratorio de Entomología Médica).

El sistema estandariza el control de inventario de reactivos químicos con clasificación de sustancias reguladas, rombo NFPA 704 y valoración económica, gestión de material de vidrio, bitácora cronológica de equipos y control unificado de préstamos a terceros.

---

## 🚀 Arquitectura y Tecnologías
* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS.
* **Diseño:** [Terra Lab Design System](DESIGN.md) ("Natural Precision", Literata + Nunito Sans).
* **Backend:** PostgreSQL (Supabase), Row Level Security (RLS), Supabase Auth y Triggers atómicos.
* **Despliegue:** Vercel (Jamstack con Deploy Previews automáticos por PR).
* **Calidad y CI/CD:** GitHub Actions, ESLint, Vitest, SonarQube Cloud y Conventional Commits.

---

## 📚 Documentación Clave del Proyecto
* **Directivas para Agentes de IA:** [AGENTS.md](AGENTS.md)
* **Plan de Desarrollo Seguro con IA:** [docs/PLAN_DESARROLLO_SEGURO_IA.md](docs/PLAN_DESARROLLO_SEGURO_IA.md)
* **Historias de Usuario (Backlog):** [docs/HISTORIAS_DE_USUARIO.md](docs/HISTORIAS_DE_USUARIO.md)
* **Modelo de Dominio y Datos:** [docs/modelo_de_dominio.md](docs/modelo_de_dominio.md)
* **Especificación de Diseño (Terra Lab):** [DESIGN.md](DESIGN.md)
* **Prototipos y Wireframes:** [prototype/wireframes_mobile_png/](prototype/wireframes_mobile_png/)

---

## 🛠️ Entorno de Desarrollo y Comandos
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo local
npm run dev

# Verificación de tipos TypeScript
npx tsc --noEmit

# Ejecutar linter
npm run lint

# Ejecutar pruebas unitarias con cobertura
npm run test:coverage

# Compilar para producción
npm run build
```

---

## 🛡️ Protocolo de Contribución (GitHub Flow)
1. Desprender ramas desde `main`: `feat/hu<numero>-<descripcion>`, `fix/<descripcion>`.
2. Escribir mensajes de confirmación bajo **Conventional Commits**: `feat(scope): message`.
3. Validar localmente antes de hacer push (`npm run lint`, `npx tsc --noEmit`, `npm run test`).
4. Abrir Pull Request con plantilla vinculando el Issue (`Closes #<numero>`).
5. La fusión a `main` requiere aprobación de SonarCloud Quality Gate y CI en verde.
