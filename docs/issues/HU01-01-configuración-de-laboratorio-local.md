# [HU01] Autenticación y Contexto de Laboratorio

### Descripción
Como personal o administrador del laboratorio, quiero autenticarme mediante credenciales seguras y seleccionar o tener asignado mi laboratorio activo (LEPA o LEM), para operar el sistema a través de la web con el contexto de datos adecuado.

### Criterios de Aceptación
1. El sistema proporciona una pantalla de autenticación segura (login con email y contraseña) gestionada por Supabase Auth.
2. Una vez autenticado, el usuario opera bajo el contexto de su laboratorio asignado (LEPA o LEM), o permite a usuarios administradores alternar fácilmente el laboratorio activo desde el encabezado.
3. La interfaz filtra y presenta los datos de inventario y bitácora correspondientes al laboratorio activo seleccionado.
4. Muestra de forma visible y destacada en el encabezado de la aplicación el laboratorio activo y el correo/rol del usuario autenticado.
5. Permite cerrar sesión de forma segura y protege las rutas privadas ante accesos no autenticados.

### Pantallas Relacionadas (Wireframes)
* `prototype/wireframes_mobile_png/INICIAR_SESION.png`
* `prototype/wireframes_mobile_png/INICIO_PASO_1.png`
* `prototype/wireframes_mobile_png/INICIO_PASO_2.png`
* `prototype/wireframes_mobile_png/INICIO_PASO_3.png`
