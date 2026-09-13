# [HU09] Registro de Préstamos Generales (Frasco o Fracción)

### Descripción
Como personal del laboratorio emisor, quiero registrar préstamos de reactivos a cualquier solicitante (interno, de otro laboratorio o externo), indicando si se entrega un frasco completo o una fracción, para mantener la trazabilidad de los insumos prestados en la nube.

### Criterios de Aceptación
1. Permite registrar préstamos a cualquier persona solicitante, registrando: Nombre completo, Cédula / Identificación, Departamento / Laboratorio / Institución de procedencia y teléfono o correo de contacto.
2. Permite seleccionar la modalidad de préstamo:
   - **Frasco Completo:** Se presta el envase físico completo (el frasco se marca temporalmente como no disponible en el stock local).
   - **Fracción / Alícuota:** Se entrega una cantidad específica (ej. 50 ml, 10 g), descontándose esa porción del stock local.
3. Permite ingresar la fecha del préstamo, la fecha estimada de retorno y observaciones de uso.
4. Genera el registro del préstamo en la base de datos centralizada bajo el estado "En Préstamo / Activo" y asienta el movimiento en la bitácora institucional vinculando al usuario autenticado.

### Pantallas Relacionadas (Wireframes)
* `prototype/wireframes_mobile_png/PRESTAMO.png`
* `prototype/wireframes_mobile_png/PRESTAMO_2.png`
* `prototype/wireframes_mobile_png/PRESTAMO_3.png`
* `prototype/wireframes_mobile_png/PRESTAMO_4.png`
