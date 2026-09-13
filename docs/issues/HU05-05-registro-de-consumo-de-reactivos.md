# [HU05] Registro de Consumo de Reactivos

### Descripción
Como personal del laboratorio, quiero registrar cada consumo de reactivo que realizo, para mantener el stock físico actualizado en tiempo real y registrar la trazabilidad del usuario autenticado.

### Criterios de Aceptación
1. Permite seleccionar un reactivo del inventario físico del laboratorio activo y registrar un egreso o consumo.
2. Vincula automáticamente al usuario autenticado (Supabase Auth) como responsable del consumo, solicitando la cantidad exacta consumida y la fecha.
3. Descuenta automáticamente y de forma atómica la cantidad consumida del stock físico actual disponible.
4. Valida que la cantidad a consumir sea estrictamente positiva y menor o igual al stock disponible (evita cantidades negativas).
5. Genera de forma inmediata una entrada inmutable de tipo "Consumo" en la bitácora de movimientos.

### Pantallas Relacionadas (Wireframes)
* `prototype/wireframes_mobile_png/INVENTARIO _ MOVIMIENTOS _ CONSUMO.png`
* `prototype/wireframes_mobile_png/INVENTARIO _ MOVIMIENTOS _ CONSUMO _ EXITOSO.png`
