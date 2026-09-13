# [HU04] Registro de Stock Físico

### Descripción
Como personal del laboratorio, quiero registrar la cantidad física, ubicación, precio de adquisición y umbrales de los reactivos de mi laboratorio en la nube, para conocer la disponibilidad real, el valor económico y el estado del inventario local.

### Criterios de Aceptación
1. Permite asociar una existencia física (`StockReactivo`) a un reactivo del catálogo, vinculada al laboratorio activo configurado.
2. Campos obligatorios: cantidad física actual (con unidad de medida), ubicación física detallada (armario, estante, refrigerador) y umbral de cantidad mínima antes de alerta.
3. Permite registrar el último precio adquirido por lote o frasco en dólares (`USD`) o bolívares (`VES`), facilitando la valoración económica del stock.
4. Permite ingresar una fecha de vencimiento (opcional, cuando aplique) validando que corresponda a una fecha válida.
5. Distingue automáticamente si el stock corresponde a un insumo de uso común o de uso exclusivo del laboratorio.
6. Las políticas de seguridad (RLS) en Supabase aíslan la gestión operativa del stock físico garantizando la autonomía de cada laboratorio.

### Pantallas Relacionadas (Wireframes)
* `prototype/wireframes_mobile_png/INVENTARIO.png`
* `prototype/wireframes_mobile_png/INVENTARIO _ REACTIVOS.png`
* `prototype/wireframes_mobile_png/INVENTARIO _ REACTIVOS _ DETALLE.png`
