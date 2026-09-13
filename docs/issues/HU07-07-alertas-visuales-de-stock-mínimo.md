# [HU07] Alertas Visuales de Stock Mínimo

### Descripción
Como personal del laboratorio, quiero recibir una advertencia visual únicamente cuando las existencias de un reactivo desciendan por debajo de su umbral mínimo sin llegar a cero, para reabastecer oportunamente sin generar alertas innecesarias sobre insumos no disponibles.

### Criterios de Aceptación
1. El sistema evalúa la condición de alerta de stock mínimo estrictamente como: $0 < \text{stock\_actual} \le \text{umbral\_minimo}$.
2. Si el reactivo no tiene existencia física o su stock actual es igual a cero ($0$), el sistema **no genera alertas de stock mínimo** (se visualiza como "Sin existencias").
3. Mientras el stock permanezca por debajo del umbral, el sistema mantiene una **única advertencia persistente y fija**, sin duplicar ni acumular notificaciones por consumos intermedios.
4. La advertencia visual destacada se muestra en el catálogo de inventario y en el Dashboard.
5. La advertencia se desactiva únicamente cuando un nuevo ingreso o ajuste incremente el stock por encima del umbral ($\text{stock\_actual} > \text{umbral\_minimo}$).

### Pantallas Relacionadas (Wireframes)
* `prototype/wireframes_mobile_png/DASHBOARD.png` (Bloque "Alertas de reactivos": tarjeta de escasez)
* `prototype/wireframes_mobile_png/INVENTARIO _ REACTIVOS.png` (Indicador visual lateral en tarjetas de inventario)
