# [HU03] Consistencia de Códigos Compartidos

### Descripción
Como administrador de ambos laboratorios, quiero asegurar la unicidad y consistencia de los códigos de reactivos compartidos en la base de datos centralizada, para evitar discrepancias e inventarios duplicados.

### Criterios de Aceptación
1. La base de datos centralizada valida mediante restricción de unicidad (`UNIQUE(codigo_unico)`) que no existan reactivos distintos con el mismo código.
2. Al registrar o editar un reactivo, el sistema valida en tiempo real la disponibilidad del código y previene duplicaciones accidentales.
3. Permite clasificar reactivos como "Insumo de Uso Común", lo cual los habilita para transferencias y préstamos inter-laboratorios.
4. Facilita la búsqueda y visualización del listado completo de códigos estandarizados institucionales.

### Pantallas Relacionadas (Wireframes)
* `prototype/wireframes_mobile_png/INVENTARIO _ REACTIVOS _ DETALLE.png` (Visualización de código único de reactivo compartido)
