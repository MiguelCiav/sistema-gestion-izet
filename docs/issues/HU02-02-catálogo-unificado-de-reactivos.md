# [HU02] Catálogo Unificado de Reactivos

### Descripción
Como personal científico o administrador, quiero registrar y gestionar reactivos químicos en un catálogo centralizado en la nube, indicando si son sustancias reguladas y su último precio referencial, para cumplir con normativas legales, evitar duplicidades y estimar costos de reposición.

### Criterios de Aceptación
1. Permite crear, consultar, actualizar y dar de baja lógica reactivos del catálogo centralizado.
2. Campos obligatorios del reactivo: Código único del reactivo químico, Nombre, Fórmula química y Clasificación de riesgo.
3. Soporta registrar y visualizar los 4 cuadrantes del rombo de riesgo NFPA 704 (Salud, Inflamabilidad, Inestabilidad y Riesgo Especial con valores numéricos 0-4 y códigos especiales estándar).
4. Permite clasificar si el reactivo es **"Sustancia Regulada / Controlada"** y registrar las entidades fiscalizadoras correspondientes (ej. RESQUIMIC, CICPC, DAEX, MPPSP).
5. Permite registrar el **último precio adquirido**, especificando el monto y la moneda (`USD` o `VES`) con su fecha de registro referencial.
6. Al ser un catálogo centralizado en la nube (Supabase), cualquier reactivo registrado queda inmediatamente disponible como referencia para las existencias físicas de LEPA y LEM.
7. Valida la integridad referencial: no permite la eliminación física de reactivos que cuenten con stock físico o bitácora histórica de consumo.

### Pantallas Relacionadas (Wireframes)
* `prototype/wireframes_mobile_png/INVENTARIO _ REACTIVOS.png`
* `prototype/wireframes_mobile_png/INVENTARIO _ REACTIVOS _ DETALLE.png`
