# Historias de Usuario Propuestas: Sistema de Gestión Automatizado LEPA-LEM

Este documento recopila las historias de usuario propuestas para el desarrollo del **Sistema de Gestión Automatizado LEPA-LEM**, organizadas por módulos y adaptadas a una arquitectura Cloud / Jamstack (**Supabase** para base de datos y autenticación, **Vercel / Cloudflare Pages** para el frontend), bajo la restricción metodológica de **100 horas de desarrollo**.

---

## Módulo 1: Autenticación, Contexto y Datos Maestros (Core - MVP)
* **HU01 - Autenticación y Contexto de Laboratorio:** Iniciar sesión de forma segura y establecer el contexto del laboratorio activo (LEPA o LEM) para la gestión web de datos.
* **HU02 - Catálogo Unificado de Reactivos:** Crear y gestionar el catálogo centralizado de reactivos químicos con código único, nombre, fórmula, riesgo, rombo NFPA 704, clasificación de **sustancia regulada** y **último precio adquirido** (USD/VES).
* **HU03 - Consistencia de Códigos Compartidos:** Garantizar la unicidad y consistencia relacional de códigos de reactivos compartidos entre laboratorios en la base de datos centralizada.

## Módulo 2: Control de Inventario y Existencias (Core - MVP)
* **HU04 - Registro de Stock Físico:** Controlar el stock físico de reactivos por laboratorio en la nube, registrando cantidad, ubicación física, umbral mínimo, caducidad y último precio de adquisición.
* **HU05 - Registro de Consumo de Reactivos:** Registrar salidas o consumos de reactivos con descuento automático de stock y trazabilidad del usuario autenticado.
* **HU06 - Bitácora de Movimientos de Inventario:** Consultar el historial inmutable de movimientos y consumos para auditorías institucionales de recursos.
* **HU07 - Alertas Visuales de Stock Mínimo:** Visualizar una advertencia persistente y única en la interfaz únicamente cuando el reactivo descienda de su umbral sin llegar a cero ($0 < \text{stock} \le \text{umbral}$).
* **HU08 - Alertas de Vencimiento de Reactivos:** Mostrar avisos de caducidad para los reactivos próximos a expirar o vencidos.

## Módulo 3: Préstamos de Laboratorio (MVP - Crítico por Requisitos)
* **HU09 - Registro de Préstamos Generales (Frasco o Fracción):** Registrar la salida de préstamos a cualquier persona solicitante (interna o externa), soportando frasco completo o alícuota/fracción.
* **HU10 - Retorno y Cierre de Préstamos:** Controlar préstamos activos, registrar la devolución de frascos o remanentes de sustancias y asentar incidencias o cierre definitivo.

## Módulo 4: Control de Material de Vidrio (Baja Prioridad - Fuera del MVP)
* **HU11 - Inventario de Material de Vidrio (En Stock vs En Uso):** Registrar y gestionar utensilios de vidrio diferenciando cantidades "En Stock" (reserva) y "En Uso" (mesones), con transferencias entre estados.
* **HU12 - Control de Estado y Bajas de Vidrio:** Registrar la condición cualitativa y reportar roturas o mermas distinguiendo si el material estaba en uso o en stock.

## Módulo 5: Gestión y Bitácoras de Equipos (Baja Prioridad - Fuera del MVP)
* **HU13 - Inventario de Equipos de Medición:** Registrar los equipos de medición por laboratorio, indicando marca, modelo, activo patrimonial (UCV) y tipo de mantenimiento preventivo.
* **HU14 - Bitácora de Uso de Equipos:** Registrar el uso diario de los equipos de medición desde cualquier dispositivo web (quién, qué equipo, fecha, duración y fin).
* **HU15 - Programación de Calibraciones y Limpiezas:** Visualizar de forma consolidada el estado y cronograma del próximo mantenimiento planificado.
* **HU16 - Registro de Mantenimiento Ejecutado:** Registrar la realización de calibraciones o limpiezas en la bitácora de mantenimiento y reprogramar el siguiente ciclo.

## Módulo 6: Reportes, Valoración y Misceláneos (Prioridad Media)
* **HU17 - Exportación de Stock Crítico y Regulados (PDF/CSV):** Exportar listados de reactivos críticos, sustancias reguladas e inventarios valorizados (USD/VES) en formatos PDF y CSV directamente desde el navegador.
* **HU18 - Inventario y Control de Misceláneos:** Registrar y controlar artículos misceláneos (oficina, mobiliario, consumibles) con unidades de medida personalizadas, último precio y umbral de alerta.
