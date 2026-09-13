# [HU06] Bitácora de Movimientos de Inventario

### Descripción
Como administrador o personal del laboratorio, quiero consultar un historial cronológico centralizado de todos los movimientos de stock, para auditar quién consumió o transfirió qué reactivo, en qué fecha y en qué cantidad.

### Criterios de Aceptación
1. Muestra un listado ordenado cronológicamente (más recientes primero) de todos los consumos, ajustes de stock y préstamos registrados.
2. Cada entrada de la bitácora detalla de forma inmutable: fecha y hora, usuario autenticado responsable, reactivo, cantidad afectada, tipo de movimiento y laboratorio.
3. Los registros de la bitácora son estrictamente de solo lectura (no modificables ni eliminables) para asegurar la fidelidad de auditoría.
4. Permite aplicar filtros rápidos por tipo de movimiento (consumo, ajuste, préstamo), rango de fechas, usuario responsable o reactivo.
5. Permite consultar movimientos filtrados por el laboratorio activo o de manera consolidada institucional para usuarios administradores.

### Pantallas Relacionadas (Wireframes)
* `prototype/wireframes_mobile_png/INVENTARIO _ REACTIVOS _ HISTORIAL.png`
* `prototype/wireframes_mobile_png/HISTORIAL.png`
