# [HU08] Alertas de Vencimiento de Reactivos

### Descripción
Como personal del laboratorio, quiero ver avisos visuales sobre reactivos próximos a vencer o vencidos, para prevenir el uso de químicos degradados en experimentos y análisis.

### Criterios de Aceptación
1. El sistema evalúa dinámicamente la fecha de vencimiento de cada lote de reactivo frente a la fecha actual, ignorando reactivos que no requieran caducidad.
2. Muestra indicadores visuales diferenciados para los reactivos que estén "Próximos a Vencer" (en los siguientes 30 días) y "Vencidos".
3. Los reactivos vencidos se visualizan con una advertencia de uso crítico y requieren una confirmación explícita si se intenta registrar un consumo.
4. Permite ordenar y filtrar el inventario según la fecha de vencimiento o el estado de alerta de caducidad.

### Pantallas Relacionadas (Wireframes)
* `prototype/wireframes_mobile_png/DASHBOARD.png` (Bloque "Alertas de reactivos": tarjeta de caducidad)
* *(Nota: Pantalla o modal con lista detallada de reactivos vencidos/por expirar pendiente de diseño en Figma)*
