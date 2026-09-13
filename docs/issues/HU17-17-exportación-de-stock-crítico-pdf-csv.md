# [HU17] Exportación de Stock Crítico y Regulados (PDF/CSV)

### Descripción
Como administrador o personal del laboratorio, quiero exportar listados de reactivos críticos, sustancias reguladas o inventarios valorizados en formatos PDF y CSV directamente desde el navegador, para tramitar órdenes de compra, balances económicos e inspecciones legales.

### Criterios de Aceptación
1. Permite generar reportes en formatos PDF (con membrete institucional IZT-UCV apto para impresión) y CSV (para análisis en hojas de cálculo).
2. Proporciona filtros especializados de exportación:
   - Reactivos en stock crítico ($0 < \text{stock} \le \text{umbral}$).
   - Reactivos y sustancias **reguladas / controladas** (para entes fiscalizadores como RESQUIMIC, CICPC, DAEX).
   - Reactivos vencidos o próximos a expirar.
   - Inventario general valorizado con el **último precio adquirido** en USD y VES.
3. Permite exportar por el laboratorio activo o consolidado institucional para ambos laboratorios.
4. La generación y descarga se procesa en el navegador en un tiempo no mayor a 3 segundos.

### Pantallas Relacionadas (Wireframes)
* `prototype/wireframes_mobile_png/INVENTARIO.png` (Botón de acción rápida "Reporte")
* *(Nota: Modal/pantalla de configuración de exportación con selección de formato PDF/CSV, filtros de reactivos críticos, sustancias reguladas y catálogo valorizado pendientes de diseño en Figma)*

> [!NOTE]
> Esta historia está clasificada como de **Prioridad Media** para el desarrollo en función de las vistas reutilizables de stock.
