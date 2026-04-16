# LABCEL San Antonio - PRD

## Descripcion General
Tienda online para venta de fundas personalizadas para telefonos con posibilidad de expansion a otros productos tecnologicos.

## Fecha de Creacion
3 de Febrero, 2026

## Ultima Actualizacion
16 de Abril, 2026 - PWA completa implementada y verificada

## User Personas
1. **Cliente Final**: Usuario que desea personalizar fundas con sus propias imagenes
2. **Administrador**: Gestiona productos, pedidos, usuarios y estadisticas

## Requisitos Core (Estaticos)
- Personalizacion de fundas con subida de imagenes
- Seleccion de marca y modelo de telefono
- Sistema de pedidos con rastreo en tiempo real
- Panel de administracion completo
- Autenticacion con Google OAuth
- Notificaciones por WhatsApp y Email
- Terminos y condiciones / Politicas de privacidad
- App movil instalable (PWA)

## Implementado
- [x] Diseno futurista con colores neon verde (#00FF88) y cyan (#00D4FF)
- [x] Landing page con hero, features y productos destacados
- [x] Seccion de agradecimiento a Emergent AI en el footer
- [x] Catalogo de productos con busqueda y filtros
- [x] Personalizador de fundas con vista previa en tiempo real
- [x] Vista previa con camaras dinamicas segun modelo de telefono seleccionado
- [x] Subida de imagenes personalizadas (max 5MB)
- [x] Seleccion de marca/modelo de telefono (Apple, Samsung, Xiaomi, Huawei, Motorola)
- [x] Modelos ampliados: iPhone 11-17, Galaxy S21-S25, Z Fold/Flip, Redmi, POCO, Mi, Huawei P/Mate, Moto G/E
- [x] Carrito de compras persistente (localStorage)
- [x] Checkout con formulario completo
- [x] Metodo de pago: Transferencia o Pago al Recoger en Tienda
- [x] Rastreo de pedidos por numero de orden
- [x] Panel Admin: Dashboard con estadisticas
- [x] Panel Admin: Gestion de productos (CRUD) con carga de imagenes
- [x] Panel Admin: Gestion de pedidos con cambio de estado
- [x] Panel Admin: Gestion de usuarios y roles
- [x] Panel Admin: Envio de propuestas de diseno
- [x] Autenticacion Google OAuth (Emergent Auth)
- [x] Sistema de estados: pendiente -> confirmado -> en_proceso -> enviado -> entregado
- [x] Terminos y condiciones
- [x] Politica de privacidad
- [x] API RESTful completa con FastAPI
- [x] Base de datos MongoDB
- [x] Correo de contacto actualizado: labcelsanantonio@gmail.com
- [x] Moneda en pesos mexicanos (MXN)
- [x] **PWA - Progressive Web App** (Abril 2026)
  - [x] manifest.json con display:standalone, 8 iconos, shortcuts
  - [x] Service Worker con cache strategies (Network First, Cache First)
  - [x] Pagina offline personalizada
  - [x] Meta tags PWA (apple-touch-icon, apple-mobile-web-app-capable, theme-color)
  - [x] Componente InstallPWA con soporte Android/Desktop + instrucciones iOS
  - [x] Service Worker registration automatica

## Productos Disponibles
| Producto | Precio | Descripcion |
|----------|--------|-------------|
| Funda Personalizada Una Pieza | $180 | Uso normal, diseno elegante |
| Funda Personalizada Dos Piezas | $280 | Uso rudo, maxima proteccion |

## Backlog - Proximas Funcionalidades

### P0 (Critico)
- [ ] Integrar Twilio para notificaciones WhatsApp reales
- [ ] Integrar Resend para notificaciones por email reales

### P1 (Alto)
- [ ] Pasarela de pagos (Stripe/PayPal) o info de transferencia bancaria
- [ ] Historial de disenos guardados por usuario
- [ ] Galeria de plantillas predisenadas
- [ ] Sistema de cupones y descuentos

### P2 (Medio)
- [ ] Sistema de resenas y calificaciones
- [ ] Categorias adicionales de productos
- [ ] Sistema de inventario con alertas de stock bajo
- [ ] Multiples direcciones de envio por usuario

## Stack Tecnologico
- **Frontend**: React 19, Tailwind CSS, Shadcn UI, React Router
- **Backend**: FastAPI, Motor (MongoDB async)
- **Database**: MongoDB
- **Auth**: Emergent Google OAuth
- **PWA**: Service Worker, Web App Manifest
- **Notificaciones**: Twilio (WhatsApp), Resend (Email) - PENDIENTE CREDENCIALES

## APIs Externas
- Google OAuth via Emergent Auth
- Twilio WhatsApp API (MOCKED - pendiente credenciales)
- Resend Email API (MOCKED - pendiente credenciales)

## Estructura de Base de Datos
- `users`: Usuarios registrados
- `user_sessions`: Sesiones de autenticacion
- `products`: Catalogo de productos
- `phone_brands`: Marcas de telefonos
- `phone_models`: Modelos de telefonos
- `orders`: Pedidos con historial de estados
- `uploaded_images`: Imagenes subidas por usuarios
- `notifications`: Log de notificaciones enviadas

## Notas de Desarrollo
- Las notificaciones de WhatsApp y Email estan simuladas (MOCKED)
- Para activarlas se necesitan credenciales de Twilio y Resend
- El primer usuario que se registre puede ser promovido a admin desde la DB
- La PWA permite instalar la app desde el navegador en Android, iOS y Desktop
