---
name: terra-lab-design-system
description: Directrices estrictas para la creación de componentes React y estilos basados en el sistema de diseño Terra Lab (DESIGN.md) y wireframes del proyecto.
---

# Terra Lab Design System & Frontend Standards

## Cuándo usar esta skill
Usa esta skill cada vez que:
- Creas, modificas o estilizas componentes de React o vistas de la aplicación.
- Conviertes wireframes (`prototype/wireframes_mobile_png/`) en código funcional.
- Diseñas formularios, botones, tarjetas, modales o indicadores de alerta.

## Filosofía de Diseño: "Natural Precision"
Terra Lab fusiona la precisión metódica y estéril de un laboratorio científico con tonos cálidos y orgánicos de la tierra, alejándose de los azules genéricos de la tecnología tradicional.

### 1. Tokens de Color Oficiales
Usa las clases semánticas mapeadas en Tailwind (o variables CSS):
- **Superficies:**
  - `bg-surface-warm` (`#faf6f0`): Fondo principal para reducir fatiga visual.
  - `bg-surface-container` (`#ecefeb`): Contenedores secundarios y tarjetas.
  - `bg-surface-container-high` (`#eae6de`): Elementos elevados y encabezados de sección.
- **Marca y Acciones:**
  - `primary` (`#4a7c59`): Verde orgánico para botones de acción principal y estados activos.
  - `primary-container` (`#78a886`) / `on-primary-container` (`#e1ffe5`).
  - `secondary` (`#6b6358`): Taupe neutro-cálido para textos secundarios e íconos auxiliares.
- **Alertas y Riesgos:**
  - `error-red` (`#ba1a1a`): Errores y reactivos vencidos.
  - `amber-600` / `tertiary` (`#705c30`): Advertencias de stock bajo umbral ($0 < \text{stock} \le \text{umbral}$).
- **Texto:**
  - `on-surface` (`#181c1b`): Texto principal en carbón profundo (no negro puro).
  - `on-surface-variant` (`#414942`): Texto secundario y metadatos.

### 2. Tipografía Oficial
- **Títulos y Branding:** Fuente **Literata** (Serif scholarly / libro).
  - `font-display`: Clases para titulares destacados (`h1`, `h2`).
- **Cuerpo, Entradas y Botones:** Fuente **Nunito Sans** (Sans-serif limpia con bordes suaves).
  - `font-sans`: Clases para formularios, tablas, listas y texto funcional.

### 3. Formas y Geometría
- **Botones y Campos de Entrada:** `rounded-xl` (1.5rem / 24px).
- **Tarjetas y Paneles:** `rounded-2xl` o `rounded-3xl` con bordes sutiles (`border border-outline-variant/30`).
- **Botones Primarios:** Deben implementar micro-interacción de elevación suave:
  ```css
  transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:translate-y-0
  ```

### 4. Componentes Clave Obligatorios
1. **NFPA 704 Diamond (`NFPA704Diamond`):** Cuadrante estándar de 4 colores (Azul: Salud, Rojo: Inflamabilidad, Amarillo: Inestabilidad, Blanco: Especial) con valores 0-4.
2. **StatusBadge:** Etiquetas redondeadas con padding `px-3 py-1 text-xs font-bold rounded-full` indicando "Regulado", "Stock Crítico", "En Préstamo", etc.
3. **BottomNavigation / TopBar:** Barra de navegación fija con indicador de píldora activa (`primary-container`) y selector visible de contexto LEPA / LEM.

## Prohibiciones Estéticas
- **PROHIBIDO:** Usar colores hexadecimales arbitrarios en línea (ej. `bg-[#123456]`). Siempre usa las clases de tokens de Tailwind.
- **PROHIBIDO:** Bordes filosos (`rounded-none`). El sistema es suavemente redondeado.
- **PROHIBIDO:** Fondos blancos puros fluorescentes (`#ffffff`) para el fondo de pantalla; usa siempre `surface-warm` (`#faf6f0`).
