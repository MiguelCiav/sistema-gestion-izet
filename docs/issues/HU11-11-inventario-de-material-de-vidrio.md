# [HU11] Inventario de Material de Vidrio (En Stock vs En Uso)

### Descripción
Como personal de laboratorio, quiero clasificar el material de vidrio entre existencias en almacén ("En Stock") y material en mesas de trabajo ("En Uso"), y registrar transferencias entre ambos estados para un control físico realista.

### Criterios de Aceptación
1. Permite registrar y gestionar tipos de material de vidrio (ej. Vaso de precipitado 250ml, Probeta 100ml, Matraz 500ml) asociados al laboratorio activo.
2. Cada registro desglosa dos cantidades: `cantidad_en_stock` (en gaveta/reserva) y `cantidad_en_uso` (en mesones de trabajo activos).
3. Permite registrar transferencias rápidas entre estados: "Mover a En Uso" (`stock -> en_uso`) y "Retornar a Stock" (`en_uso -> stock`).
4. Muestra la cantidad total consolidada (`en_stock + en_uso`), ubicación física y último precio referencial de adquisición.
5. El inventario de vidrio se presenta claramente diferenciado del catálogo de reactivos químicos.

### Pantallas Relacionadas (Wireframes)
* `prototype/wireframes_mobile_png/INVENTARIO.png` (Acceso a la pestaña/categoría "Vidriería")
* *(Nota: Pantallas de catálogo de vidriería discriminando "En Uso" vs "En Stock" y formulario de transferencia pendientes de diseño en Figma)*

> [!NOTE]
> Esta historia está clasificada como de **Baja Prioridad / Fuera de MVP (Fase 2)** para optimizar el presupuesto de 100 horas.
