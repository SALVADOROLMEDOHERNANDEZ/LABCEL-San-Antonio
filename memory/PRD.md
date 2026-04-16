# LABCEL San Antonio - PRD

## Descripcion General
Tienda online para venta de fundas personalizadas para telefonos con posibilidad de expansion a otros productos tecnologicos.

## Fecha de Creacion
3 de Febrero, 2026

## Ultima Actualizacion
16 de Abril, 2026 - 4 nuevas funcionalidades implementadas

## User Personas
1. **Cliente Final**: Usuario que desea personalizar fundas con sus propias imagenes
2. **Administrador**: Gestiona productos, pedidos, usuarios, plantillas y cupones

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
- [x] Catalogo de productos con busqueda, filtros y resenas
- [x] Personalizador de fundas con vista previa en tiempo real
- [x] Vista previa con camaras dinamicas segun modelo de telefono
- [x] Subida de imagenes personalizadas (max 5MB)
- [x] Seleccion de marca/modelo (Apple, Samsung, Xiaomi, Huawei, Motorola)
- [x] Modelos ampliados: iPhone 11-17, Galaxy S21-S25, Z Fold/Flip, Redmi, POCO, Mi, Huawei P/Mate, Moto G/E
- [x] Carrito de compras persistente (localStorage)
- [x] Checkout con formulario completo y cupones de descuento
- [x] Metodo de pago: Transferencia o Pago al Recoger en Tienda
- [x] Rastreo de pedidos por numero de orden
- [x] Panel Admin: Dashboard, Productos, Pedidos, Usuarios, Plantillas, Cupones
- [x] Autenticacion Google OAuth (Emergent Auth)
- [x] PWA - Progressive Web App completa
- [x] Correo de contacto: labcelsanantonio@gmail.com
- [x] Moneda en pesos mexicanos (MXN)
- [x] **Galeria de Plantillas Prediseñadas** (Abril 2026)
  - [x] 8 plantillas seed (galaxia, flores, abstracto, mar, neon, mascotas, atardecer, marmol)
  - [x] Filtros por categoria (abstracto, naturaleza, mascotas)
  - [x] Busqueda por nombre y tags
  - [x] Integracion con Personalizador (click -> carga plantilla)
  - [x] Admin CRUD de plantillas
- [x] **Sistema de Cupones y Descuentos** (Abril 2026)
  - [x] Cupones porcentaje y monto fijo
  - [x] Validacion en tiempo real en Checkout
  - [x] Control de usos maximos y fecha expiracion
  - [x] Compra minima configurable
  - [x] 3 cupones seed: BIENVENIDO10, PRIMERA20, DESCUENTO50
  - [x] Admin CRUD de cupones
- [x] **Sistema de Resenas y Calificaciones** (Abril 2026)
  - [x] Estrellas 1-5 por producto
  - [x] Comentarios de usuarios autenticados
  - [x] Estadisticas de rating promedio por producto
  - [x] Seccion de resenas en Catalogo
  - [x] Rating estrellas en cards de productos
- [x] **Historial de Disenos Guardados** (Abril 2026)
  - [x] Guardar diseno desde Personalizador
  - [x] Pagina /mis-disenos con galeria
  - [x] Reutilizar disenos guardados
  - [x] Eliminar disenos

## Productos Disponibles
| Producto | Precio | Descripcion |
|----------|--------|-------------|
| Funda Personalizada Una Pieza | $180 | Uso normal, diseno elegante |
| Funda Personalizada Dos Piezas | $280 | Uso rudo, maxima proteccion |

## Cupones Disponibles
| Codigo | Tipo | Valor | Min. Compra |
|--------|------|-------|-------------|
| BIENVENIDO10 | Porcentaje | 10% | $0 |
| PRIMERA20 | Porcentaje | 20% | $280 |
| DESCUENTO50 | Monto fijo | $50 | $200 |

## Backlog - Proximas Funcionalidades

### P0 (Critico)
- [ ] Integrar Twilio para notificaciones WhatsApp reales
- [ ] Integrar Resend para notificaciones por email reales

### P1 (Alto)
- [ ] Pasarela de pagos (Stripe/PayPal) o info de transferencia bancaria
- [ ] Sistema de inventario con alertas de stock bajo

### P2 (Medio)
- [ ] Categorias adicionales de productos
- [ ] Multiples direcciones de envio por usuario
- [ ] Notificaciones push via PWA

## Stack Tecnologico
- **Frontend**: React 19, Tailwind CSS, Shadcn UI, React Router
- **Backend**: FastAPI, Motor (MongoDB async)
- **Database**: MongoDB
- **Auth**: Emergent Google OAuth
- **PWA**: Service Worker, Web App Manifest
- **Notificaciones**: Twilio (WhatsApp), Resend (Email) - PENDIENTE CREDENCIALES

## APIs Externas
- Google OAuth via Emergent Auth
- Twilio WhatsApp API (MOCKED)
- Resend Email API (MOCKED)

## Estructura de Base de Datos
- `users`: Usuarios registrados
- `user_sessions`: Sesiones de autenticacion
- `products`: Catalogo de productos
- `phone_brands`: Marcas de telefonos
- `phone_models`: Modelos de telefonos
- `orders`: Pedidos con historial de estados
- `uploaded_images`: Imagenes subidas por usuarios
- `notifications`: Log de notificaciones enviadas
- `templates`: Plantillas prediseñadas
- `coupons`: Cupones de descuento
- `reviews`: Resenas y calificaciones
- `saved_designs`: Disenos guardados por usuario
