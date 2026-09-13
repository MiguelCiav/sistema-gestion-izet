# [HU10] Retorno y Cierre de Préstamos

### Descripción
Como personal del laboratorio, quiero registrar la devolución o fin de un préstamo otorgado a terceros, para reincorporar las existencias al inventario disponible y cerrar el ciclo del préstamo.

### Criterios de Aceptación
1. Proporciona una bandeja de control de préstamos activos con filtros por solicitante, reactivo y fecha de entrega.
2. Permite registrar la devolución del insumo:
   - En préstamos de **Frasco Completo:** reactiva la disponibilidad física del envase en el inventario.
   - En préstamos de **Fracción / Alícuota:** permite reintegrar el remanente retornado (si aplica) sumándolo al stock.
3. Permite asentar incidencias o justificaciones en la devolución (ej. frasco devuelto vacío por consumo total del ensayo, o extraviado).
4. Actualiza el estado del préstamo a "Devuelto / Cerrado" y genera el registro correspondiente en la bitácora inmutable.

### Pantallas Relacionadas (Wireframes)
* `prototype/wireframes_mobile_png/PRESTAMOS_DEV_1.png`
* `prototype/wireframes_mobile_png/PRESTAMOS_DEV_2.png`
* `prototype/wireframes_mobile_png/PRESTAMOS_DEV_3.png`
