# LABCEL San Antonio - PRD

## Descripción General
Tienda online para venta de fundas personalizadas para teléfonos con posibilidad de expansión a otros productos tecnológicos.

## Fecha de Creación
3 de Febrero, 2026

## User Personas
1. **Cliente Final**: Usuario que desea personalizar fundas con sus propias imágenes
2. **Administrador**: Gestiona productos, pedidos, usuarios y estadísticas

## Requisitos Core (Estáticos)
- Personalización de fundas con subida de imágenes
- Selección de marca y modelo de teléfono
- Sistema de pedidos con rastreo en tiempo real
- Panel de administración completo
- Autenticación con Google OAuth
- Notificaciones por WhatsApp y Email
- Términos y condiciones / Políticas de privacidad

## Implementado ✅
- [x] Landing page con hero, features y productos destacados
- [x] Catálogo de productos con búsqueda y filtros
- [x] Personalizador de fundas con vista previa en tiempo real
- [x] Subida de imágenes personalizadas (max 5MB)
- [x] Selección de marca/modelo de teléfono (Apple, Samsung, Xiaomi, Huawei, Motorola)
- [x] Carrito de compras persistente (localStorage)
- [x] Checkout con formulario completo
- [x] Rastreo de pedidos por número de orden
- [x] Panel Admin: Dashboard con estadísticas
- [x] Panel Admin: Gestión de productos (CRUD)
- [x] Panel Admin: Gestión de pedidos con cambio de estado
- [x] Panel Admin: Gestión de usuarios y roles
- [x] Panel Admin: Envío de propuestas de diseño
- [x] Autenticación Google OAuth (Emergent Auth)
- [x] Sistema de estados: pendiente → confirmado → en_proceso → enviado → entregado
- [x] Términos y condiciones
- [x] Política de privacidad
- [x] API RESTful completa con FastAPI
- [x] Base de datos MongoDB

## Backlog - Próximas Funcionalidades

### P0 (Crítico)
- [ ] Integrar Twilio para notificaciones WhatsApp reales
- [ ] Integrar Resend para notificaciones por email reales
- [ ] Sistema de aprobación de diseños por el cliente

### P1 (Alto)
- [ ] Historial de diseños guardados por usuario
- [ ] Galería de plantillas prediseñadas
- [ ] Sistema de cupones y descuentos
- [ ] Múltiples direcciones de envío por usuario

### P2 (Medio)
- [ ] Integración con pasarela de pagos (Stripe/PayPal)
- [ ] Sistema de reseñas y calificaciones
- [ ] Categorías adicionales de productos
- [ ] Sistema de inventario con alertas de stock bajo

## Stack Tecnológico
- **Frontend**: React 19, Tailwind CSS, Shadcn UI, React Router
- **Backend**: FastAPI, Motor (MongoDB async)
- **Database**: MongoDB
- **Auth**: Emergent Google OAuth
- **Notificaciones**: Twilio (WhatsApp), Resend (Email) - PENDIENTE CREDENCIALES

## APIs Externas
- Google OAuth vía Emergent Auth ✅
- Twilio WhatsApp API (MOCKED - pendiente credenciales)
- Resend Email API (MOCKED - pendiente credenciales)

## Estructura de Base de Datos
- `users`: Usuarios registrados
- `user_sessions`: Sesiones de autenticación
- `products`: Catálogo de productos
- `phone_brands`: Marcas de teléfonos
- `phone_models`: Modelos de teléfonos
- `orders`: Pedidos con historial de estados
- `uploaded_images`: Imágenes subidas por usuarios
- `notifications`: Log de notificaciones enviadas

## Notas de Desarrollo
- Las notificaciones de WhatsApp y Email están simuladas (MOCKED)
- Para activarlas se necesitan credenciales de Twilio y Resend
- El primer usuario que se registre puede ser promovido a admin desde la DB
