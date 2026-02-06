# 📱 LABCEL San Antonio - Guía Técnica Completa

## Documentación de Arquitectura y Funcionamiento

---

# ÍNDICE

1. [Arquitectura General](#1-arquitectura-general)
2. [Estructura de Archivos](#2-estructura-de-archivos)
3. [Backend (FastAPI + MongoDB)](#3-backend-fastapi--mongodb)
4. [Frontend (React + Tailwind)](#4-frontend-react--tailwind)
5. [Flujo de Datos](#5-flujo-de-datos)
6. [Base de Datos](#6-base-de-datos)
7. [Autenticación](#7-autenticación)
8. [API Endpoints](#8-api-endpoints)
9. [Componentes UI](#9-componentes-ui)
10. [Despliegue](#10-despliegue)

---

# 1. ARQUITECTURA GENERAL

```
┌─────────────────┐     HTTP/REST     ┌─────────────────┐     MongoDB     ┌─────────────────┐
│                 │    ◄──────────►   │                 │   ◄──────────►  │                 │
│    FRONTEND     │                   │     BACKEND     │                 │    DATABASE     │
│   React:3000    │                   │   FastAPI:8001  │                 │   MongoDB:27017 │
│                 │                   │                 │                 │                 │
└─────────────────┘                   └─────────────────┘                 └─────────────────┘
        │                                     │
        │                                     │
        ▼                                     ▼
   Tailwind CSS                         Motor (async)
   Shadcn UI                            Pydantic
   React Router                         Python-Jose
```

## Tecnologías Principales

| Capa | Tecnología | Propósito |
|------|------------|-----------|
| Frontend | React 19 | Interfaz de usuario |
| Estilos | Tailwind CSS | Framework CSS utilitario |
| Componentes | Shadcn UI (Radix) | Componentes accesibles |
| Routing | React Router DOM | Navegación SPA |
| HTTP Client | Axios | Comunicación con API |
| Backend | FastAPI | Framework API Python |
| Database | MongoDB | Base de datos NoSQL |
| Driver DB | Motor | Driver async MongoDB |
| Auth | Google OAuth | Autenticación social |

---

# 2. ESTRUCTURA DE ARCHIVOS

```
labcel-san-antonio/
│
├── backend/                    # ══════ SERVIDOR API ══════
│   ├── server.py              # Archivo principal del backend
│   ├── requirements.txt       # Dependencias Python
│   └── .env                   # Variables de entorno
│
├── frontend/                   # ══════ APLICACIÓN WEB ══════
│   ├── public/
│   │   └── index.html         # HTML base
│   │
│   ├── src/
│   │   ├── index.js           # Punto de entrada React
│   │   ├── index.css          # Estilos globales + Tailwind
│   │   ├── App.js             # Componente raíz + Router
│   │   ├── App.css            # Estilos adicionales
│   │   │
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── Navbar.js      # Barra de navegación
│   │   │   ├── Footer.js      # Pie de página
│   │   │   ├── AuthCallback.js    # Manejo OAuth
│   │   │   ├── ProtectedRoute.js  # Rutas protegidas
│   │   │   ├── AdminLayout.js     # Layout panel admin
│   │   │   └── ui/            # Componentes Shadcn
│   │   │       ├── button.jsx
│   │   │       ├── input.jsx
│   │   │       ├── dialog.jsx
│   │   │       ├── select.jsx
│   │   │       ├── slider.jsx
│   │   │       └── ... (30+ componentes)
│   │   │
│   │   ├── pages/             # Páginas de la aplicación
│   │   │   ├── Home.js        # Página principal
│   │   │   ├── Catalog.js     # Catálogo de productos
│   │   │   ├── Customizer.js  # Personalizador de fundas
│   │   │   ├── Cart.js        # Carrito de compras
│   │   │   ├── Checkout.js    # Proceso de compra
│   │   │   ├── TrackOrder.js  # Rastreo de pedidos
│   │   │   ├── MyOrders.js    # Mis pedidos (usuario)
│   │   │   ├── Terms.js       # Términos y condiciones
│   │   │   ├── Privacy.js     # Política de privacidad
│   │   │   └── admin/         # Panel de administración
│   │   │       ├── Dashboard.js   # Dashboard admin
│   │   │       ├── Products.js    # Gestión productos
│   │   │       ├── Orders.js      # Gestión pedidos
│   │   │       └── Users.js       # Gestión usuarios
│   │   │
│   │   └── context/           # Estado global React
│   │       ├── AuthContext.js # Contexto autenticación
│   │       └── CartContext.js # Contexto carrito
│   │
│   ├── package.json           # Dependencias Node.js
│   ├── tailwind.config.js     # Configuración Tailwind
│   └── .env                   # Variables de entorno
│
└── memory/
    └── PRD.md                 # Documento de requerimientos
```

---

# 3. BACKEND (FastAPI + MongoDB)

## 3.1 Archivo Principal: `server.py`

### Estructura del Código

```python
# ══════════════════════════════════════════════════════════════
# SECCIÓN 1: IMPORTS Y CONFIGURACIÓN
# ══════════════════════════════════════════════════════════════

from fastapi import FastAPI, APIRouter, HTTPException, ...
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Conexión MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Crear aplicación FastAPI
app = FastAPI(title="LABCEL San Antonio API")
api_router = APIRouter(prefix="/api")
```

### Sección de Modelos Pydantic

```python
# ══════════════════════════════════════════════════════════════
# SECCIÓN 2: MODELOS DE DATOS (Pydantic)
# ══════════════════════════════════════════════════════════════

class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "customer"  # customer, admin
    phone: Optional[str] = None
    whatsapp_number: Optional[str] = None
    created_at: datetime

class Product(BaseModel):
    product_id: str
    name: str
    description: str
    price: float
    category: str = "funda"
    base_image_url: Optional[str] = None
    is_customizable: bool = True
    is_active: bool = True
    stock: int = 100

class CartItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    price: float
    phone_brand: Optional[str] = None
    phone_model: Optional[str] = None
    custom_image_url: Optional[str] = None
    preview_image_url: Optional[str] = None

class Order(BaseModel):
    order_id: str
    user_id: Optional[str] = None
    items: List[CartItem]
    customer_name: str
    customer_email: str
    customer_phone: str
    shipping_address: str
    payment_method: str  # transferencia, recoger_tienda
    status: str = "pendiente"
    status_history: List[Dict]
    total: float
```

### Sección de Autenticación

```python
# ══════════════════════════════════════════════════════════════
# SECCIÓN 3: HELPERS DE AUTENTICACIÓN
# ══════════════════════════════════════════════════════════════

async def get_current_user(request: Request) -> Optional[Dict]:
    """Obtiene usuario actual desde cookie o header"""
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        return None
    
    session = await get_session_from_token(session_token)
    if not session:
        return None
    
    user = await db.users.find_one(
        {"user_id": session["user_id"]},
        {"_id": 0}  # Excluir _id de MongoDB
    )
    return user

async def require_admin(request: Request) -> Dict:
    """Requiere rol de administrador"""
    user = await require_auth(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Acceso denegado")
    return user
```

### Sección de Rutas API

```python
# ══════════════════════════════════════════════════════════════
# SECCIÓN 4: RUTAS DE LA API
# ══════════════════════════════════════════════════════════════

# --- Autenticación ---
@api_router.post("/auth/session")      # Intercambiar session_id por datos
@api_router.get("/auth/me")            # Obtener usuario actual
@api_router.post("/auth/logout")       # Cerrar sesión

# --- Productos ---
@api_router.get("/products")           # Listar productos
@api_router.get("/products/{id}")      # Obtener producto
@api_router.post("/products")          # Crear producto (admin)
@api_router.put("/products/{id}")      # Actualizar producto (admin)
@api_router.delete("/products/{id}")   # Eliminar producto (admin)

# --- Teléfonos ---
@api_router.get("/phone-brands")       # Listar marcas
@api_router.get("/phone-models")       # Listar modelos

# --- Pedidos ---
@api_router.post("/orders")            # Crear pedido
@api_router.get("/orders")             # Listar pedidos
@api_router.get("/orders/{id}")        # Obtener pedido
@api_router.get("/orders/track/{id}")  # Rastrear pedido (público)
@api_router.put("/orders/{id}/status") # Actualizar estado (admin)

# --- Usuarios ---
@api_router.get("/users")              # Listar usuarios (admin)
@api_router.put("/users/{id}/role")    # Cambiar rol (admin)

# --- Upload ---
@api_router.post("/upload/image")      # Subir imagen

# --- Admin ---
@api_router.get("/admin/stats")        # Estadísticas (admin)
```

## 3.2 Variables de Entorno: `.env`

```env
# Conexión a MongoDB
MONGO_URL=mongodb://localhost:27017
DB_NAME=labcel_db

# (Opcional) Para notificaciones
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

RESEND_API_KEY=re_xxxxx
SENDER_EMAIL=tu@email.com
```

---

# 4. FRONTEND (React + Tailwind)

## 4.1 Punto de Entrada: `index.js`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Estilos globales + Tailwind
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 4.2 Componente Raíz: `App.js`

```javascript
// ══════════════════════════════════════════════════════════════
// CONFIGURACIÓN PRINCIPAL DE LA APLICACIÓN
// ══════════════════════════════════════════════════════════════

import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

// Páginas
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Customizer from "./pages/Customizer";
// ... más páginas

// Componentes
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Contextos (Estado Global)
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

// Configuración de API
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const apiClient = axios.create({
  baseURL: API,
  withCredentials: true,  // Enviar cookies
});

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>      {/* Provee estado de autenticación */}
        <CartProvider>    {/* Provee estado del carrito */}
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalogo" element={<Catalog />} />
                <Route path="/personalizar" element={<Customizer />} />
                <Route path="/carrito" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                {/* Rutas protegidas */}
                <Route path="/admin/*" element={
                  <ProtectedRoute requireAdmin>
                    <AdminRoutes />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

## 4.3 Contexto de Autenticación: `AuthContext.js`

```javascript
// ══════════════════════════════════════════════════════════════
// MANEJO DE ESTADO DE AUTENTICACIÓN
// ══════════════════════════════════════════════════════════════

import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../App';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // Usuario actual
  const [loading, setLoading] = useState(true); // Cargando...

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await apiClient.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Redirigir a Google OAuth
  const login = () => {
    const redirectUrl = window.location.origin + '/';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  // Cerrar sesión
  const logout = async () => {
    await apiClient.post('/auth/logout');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar autenticación
export function useAuth() {
  return useContext(AuthContext);
}
```

## 4.4 Contexto del Carrito: `CartContext.js`

```javascript
// ══════════════════════════════════════════════════════════════
// MANEJO DE ESTADO DEL CARRITO DE COMPRAS
// ══════════════════════════════════════════════════════════════

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Cargar carrito desde localStorage
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('labcel_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('labcel_cart', JSON.stringify(items));
  }, [items]);

  // Agregar producto al carrito
  const addItem = (item) => {
    setItems(prev => [...prev, { ...item, id: Date.now() }]);
  };

  // Eliminar producto
  const removeItem = (itemId) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Actualizar cantidad
  const updateQuantity = (itemId, quantity) => {
    setItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Calcular total
  const getTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ 
      items, addItem, removeItem, updateQuantity, getTotal, clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
```

## 4.5 Página del Personalizador: `Customizer.js`

```javascript
// ══════════════════════════════════════════════════════════════
// PERSONALIZADOR DE FUNDAS CON VISTA PREVIA EN TIEMPO REAL
// ══════════════════════════════════════════════════════════════

// Configuración de cámaras por modelo
const cameraConfigs = {
  'model_iphone15': { type: 'dual-diagonal', count: 2 },
  'model_iphone15pro': { type: 'triple-pro', count: 3 },
  'model_s24': { type: 'triple-vertical', count: 3 },
  'model_s24ultra': { type: 'quad-vertical', count: 4 },
  // ... más modelos
};

export default function Customizer() {
  // Estados
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [customImage, setCustomImage] = useState(null);
  const [imageScale, setImageScale] = useState([100]);
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });

  // Subir imagen personalizada
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/upload/image', formData);
    setCustomImage(response.data.url);
  };

  // Agregar al carrito
  const handleAddToCart = () => {
    addItem({
      product_id: selectedProduct.product_id,
      product_name: selectedProduct.name,
      price: selectedProduct.price,
      phone_brand: brandName,
      phone_model: modelName,
      custom_image_url: customImage,
    });
    navigate('/carrito');
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Vista previa del teléfono */}
      <div className="phone-preview">
        <CameraModule config={cameraConfigs[selectedModel]} />
        {customImage && (
          <div style={{
            backgroundImage: `url(${customImage})`,
            backgroundSize: `${imageScale}%`,
            backgroundPosition: `${imagePosition.x}% ${imagePosition.y}%`,
          }} />
        )}
      </div>
      
      {/* Panel de controles */}
      <div className="controls">
        <Select onValueChange={setSelectedBrand}>...</Select>
        <Select onValueChange={setSelectedModel}>...</Select>
        <Button onClick={handleImageUpload}>Subir Imagen</Button>
        <Slider value={imageScale} onChange={setImageScale} />
        <Button onClick={handleAddToCart}>Añadir al Carrito</Button>
      </div>
    </div>
  );
}
```

## 4.6 Variables de Entorno: `.env`

```env
# URL del backend
REACT_APP_BACKEND_URL=http://localhost:8001

# En producción:
# REACT_APP_BACKEND_URL=https://api.tudominio.com
```

---

# 5. FLUJO DE DATOS

## 5.1 Flujo de Compra Completo

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   HOME      │───►│  CATÁLOGO   │───►│PERSONALIZADOR───►│  CARRITO    │
│             │    │             │    │             │    │             │
│ Ver ofertas │    │ Ver fundas  │    │ Subir imagen│    │ Ver items   │
│ Navegar     │    │ Filtrar     │    │ Elegir modelo    │ Editar cant │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                │
                                                                ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  ENTREGADO  │◄───│   RASTREO   │◄───│ CONFIRMACIÓN│◄───│  CHECKOUT   │
│             │    │             │    │             │    │             │
│ Recibir     │    │ Ver estado  │    │ Ver número  │    │ Datos envío │
│ producto    │    │ Historial   │    │ de pedido   │    │ Método pago │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## 5.2 Flujo de Autenticación (Google OAuth)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   USUARIO   │    │   EMERGENT  │    │   GOOGLE    │    │   BACKEND   │
│   (React)   │    │    AUTH     │    │   OAUTH     │    │  (FastAPI)  │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │                  │
       │ 1. Click Login   │                  │                  │
       │─────────────────►│                  │                  │
       │                  │                  │                  │
       │                  │ 2. Redirect      │                  │
       │                  │─────────────────►│                  │
       │                  │                  │                  │
       │                  │                  │ 3. User Login    │
       │                  │                  │◄────────────────►│
       │                  │                  │                  │
       │                  │ 4. session_id    │                  │
       │◄─────────────────│◄─────────────────│                  │
       │                  │                  │                  │
       │ 5. POST /auth/session (session_id)  │                  │
       │─────────────────────────────────────────────────────►│
       │                  │                  │                  │
       │ 6. User data + session_token (cookie)                 │
       │◄─────────────────────────────────────────────────────│
       │                  │                  │                  │
```

## 5.3 Flujo de Datos: Crear Pedido

```javascript
// 1. Frontend: Enviar datos del pedido
const response = await apiClient.post('/orders', {
  items: cartItems,
  customer_name: "Juan Pérez",
  customer_email: "juan@email.com",
  customer_phone: "1234567890",
  shipping_address: "Calle 123...",
  payment_method: "recoger_tienda"
});

// 2. Backend: Procesar pedido
@api_router.post("/orders")
async def create_order(order_data: OrderCreate):
    # Calcular total
    total = sum(item.price * item.quantity for item in order_data.items)
    
    # Crear pedido en MongoDB
    order = Order(
        order_id=f"ORD-{date}-{uuid}",
        items=order_data.items,
        total=total,
        status="pendiente"
    )
    await db.orders.insert_one(order.model_dump())
    
    # Notificar admins (async)
    background_tasks.add_task(notify_admins, order)
    
    return {"order_id": order.order_id, "total": total}

// 3. Frontend: Mostrar confirmación
setOrderId(response.data.order_id);
clearCart();
navigate(`/rastrear/${orderId}`);
```

---

# 6. BASE DE DATOS

## 6.1 Colecciones MongoDB

```
labcel_db/
├── users              # Usuarios registrados
├── user_sessions      # Sesiones activas
├── products           # Catálogo de productos
├── phone_brands       # Marcas de teléfonos
├── phone_models       # Modelos de teléfonos
├── orders             # Pedidos
├── uploaded_images    # Imágenes subidas
└── notifications      # Log de notificaciones
```

## 6.2 Esquemas de Documentos

### Colección: `users`
```json
{
  "user_id": "user_abc123",
  "email": "usuario@email.com",
  "name": "Juan Pérez",
  "picture": "https://...",
  "role": "customer",  // o "admin"
  "phone": "+1234567890",
  "whatsapp_number": "+1234567890",
  "created_at": "2026-02-03T10:00:00Z"
}
```

### Colección: `products`
```json
{
  "product_id": "prod_funda_normal",
  "name": "Funda Personalizada Una Pieza",
  "description": "Funda para uso normal...",
  "price": 180.00,
  "category": "funda",
  "base_image_url": "https://...",
  "is_customizable": true,
  "is_active": true,
  "stock": 100,
  "created_at": "2026-02-03T10:00:00Z"
}
```

### Colección: `orders`
```json
{
  "order_id": "ORD-20260203-ABC123",
  "user_id": "user_abc123",
  "items": [
    {
      "product_id": "prod_funda_normal",
      "product_name": "Funda Personalizada Una Pieza",
      "quantity": 1,
      "price": 180.00,
      "phone_brand": "Apple",
      "phone_model": "iPhone 15 Pro",
      "custom_image_url": "img_xyz789",
      "preview_image_url": "data:image/jpeg;base64,..."
    }
  ],
  "customer_name": "Juan Pérez",
  "customer_email": "juan@email.com",
  "customer_phone": "+1234567890",
  "customer_whatsapp": "+1234567890",
  "shipping_address": "Calle 123, Ciudad",
  "payment_method": "recoger_tienda",
  "subtotal": 180.00,
  "total": 180.00,
  "status": "pendiente",
  "status_history": [
    {
      "status": "pendiente",
      "timestamp": "2026-02-03T10:00:00Z",
      "notes": "Pedido creado"
    }
  ],
  "design_approved": false,
  "created_at": "2026-02-03T10:00:00Z",
  "updated_at": "2026-02-03T10:00:00Z"
}
```

### Colección: `phone_brands`
```json
{
  "brand_id": "brand_apple",
  "name": "Apple",
  "logo_url": null,
  "is_active": true
}
```

### Colección: `phone_models`
```json
{
  "model_id": "model_iphone15pro",
  "brand_id": "brand_apple",
  "name": "iPhone 15 Pro",
  "image_url": null,
  "case_template_url": null,
  "is_active": true
}
```

---

# 7. AUTENTICACIÓN

## 7.1 Flujo Google OAuth (Emergent Auth)

1. **Usuario hace clic en "Iniciar Sesión"**
2. **Frontend redirige a Emergent Auth:**
   ```javascript
   window.location.href = `https://auth.emergentagent.com/?redirect=${redirectUrl}`;
   ```
3. **Usuario inicia sesión con Google**
4. **Emergent Auth redirige de vuelta con `session_id`:**
   ```
   https://tuapp.com/#session_id=abc123
   ```
5. **Frontend extrae `session_id` y lo envía al backend:**
   ```javascript
   await apiClient.post('/auth/session', { session_id });
   ```
6. **Backend intercambia `session_id` por datos del usuario:**
   ```python
   response = await httpx.get(
       "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
       headers={"X-Session-ID": session_id}
   )
   ```
7. **Backend crea/actualiza usuario y retorna cookie de sesión**

## 7.2 Protección de Rutas (Frontend)

```javascript
// ProtectedRoute.js
export default function ProtectedRoute({ children, requireAdmin }) {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
}

// Uso en App.js
<Route path="/admin" element={
  <ProtectedRoute requireAdmin>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

## 7.3 Protección de Endpoints (Backend)

```python
# Middleware de autenticación
async def require_auth(request: Request) -> Dict:
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="No autenticado")
    return user

async def require_admin(request: Request) -> Dict:
    user = await require_auth(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Acceso denegado")
    return user

# Uso en endpoints
@api_router.get("/admin/stats")
async def get_admin_stats(request: Request):
    await require_admin(request)  # Solo admins
    # ... código del endpoint
```

---

# 8. API ENDPOINTS

## 8.1 Endpoints Públicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Estado del servidor |
| GET | `/api/products` | Listar productos |
| GET | `/api/products/{id}` | Obtener producto |
| GET | `/api/phone-brands` | Listar marcas |
| GET | `/api/phone-models` | Listar modelos |
| GET | `/api/orders/track/{id}` | Rastrear pedido |
| POST | `/api/seed` | Cargar datos iniciales |

## 8.2 Endpoints de Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/session` | Intercambiar session_id |
| GET | `/api/auth/me` | Obtener usuario actual |
| POST | `/api/auth/logout` | Cerrar sesión |

## 8.3 Endpoints Protegidos (Usuario autenticado)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/orders` | Crear pedido |
| GET | `/api/orders` | Listar mis pedidos |
| GET | `/api/orders/{id}` | Obtener pedido |
| POST | `/api/upload/image` | Subir imagen |

## 8.4 Endpoints de Admin

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Estadísticas |
| GET | `/api/users` | Listar usuarios |
| PUT | `/api/users/{id}/role` | Cambiar rol |
| POST | `/api/products` | Crear producto |
| PUT | `/api/products/{id}` | Actualizar producto |
| DELETE | `/api/products/{id}` | Eliminar producto |
| PUT | `/api/orders/{id}/status` | Cambiar estado |
| POST | `/api/orders/{id}/design-proposal` | Enviar propuesta |

## 8.5 Ejemplos de Uso (curl)

```bash
# Obtener productos
curl http://localhost:8001/api/products

# Crear pedido
curl -X POST http://localhost:8001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [...],
    "customer_name": "Juan",
    "customer_email": "juan@email.com",
    "customer_phone": "123456",
    "shipping_address": "Calle 123",
    "payment_method": "recoger_tienda"
  }'

# Rastrear pedido
curl http://localhost:8001/api/orders/track/ORD-20260203-ABC123
```

---

# 9. COMPONENTES UI

## 9.1 Componentes Shadcn UI Utilizados

| Componente | Archivo | Uso |
|------------|---------|-----|
| Button | `button.jsx` | Botones en toda la app |
| Input | `input.jsx` | Campos de texto |
| Label | `label.jsx` | Etiquetas de formulario |
| Select | `select.jsx` | Selectores desplegables |
| Dialog | `dialog.jsx` | Modales/popups |
| Sheet | `sheet.jsx` | Menú lateral móvil |
| Dropdown | `dropdown-menu.jsx` | Menú desplegable |
| Slider | `slider.jsx` | Control de zoom |
| Badge | `badge.jsx` | Etiquetas de estado |
| Table | `table.jsx` | Tablas de admin |
| Textarea | `textarea.jsx` | Áreas de texto |
| RadioGroup | `radio-group.jsx` | Opciones de pago |
| Switch | `switch.jsx` | Toggle on/off |
| Toast/Sonner | `sonner.tsx` | Notificaciones |

## 9.2 Componentes Personalizados

| Componente | Archivo | Función |
|------------|---------|---------|
| Navbar | `Navbar.js` | Navegación principal |
| Footer | `Footer.js` | Pie de página |
| AuthCallback | `AuthCallback.js` | Procesar OAuth |
| ProtectedRoute | `ProtectedRoute.js` | Rutas protegidas |
| AdminLayout | `AdminLayout.js` | Layout del panel admin |
| CameraModule | `Customizer.js` | Renderizar cámaras del teléfono |

---

# 10. DESPLIEGUE

## 10.1 Requisitos del Servidor

- **Node.js** >= 18.x
- **Python** >= 3.11
- **MongoDB** >= 6.0
- **RAM**: Mínimo 1GB
- **Disco**: Mínimo 5GB

## 10.2 Variables de Entorno en Producción

### Backend (`.env`)
```env
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=labcel_production

# Opcional: Notificaciones
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=...
RESEND_API_KEY=...
```

### Frontend (`.env`)
```env
REACT_APP_BACKEND_URL=https://api.labcel.com
```

## 10.3 Comandos de Despliegue

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001

# Frontend (build de producción)
cd frontend
yarn install
yarn build
# Servir carpeta 'build' con nginx/apache
```

## 10.4 Configuración Nginx (Ejemplo)

```nginx
# Frontend
server {
    listen 80;
    server_name labcel.com;
    root /var/www/labcel/frontend/build;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Backend
server {
    listen 80;
    server_name api.labcel.com;
    
    location / {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

# APÉNDICE: DIAGRAMA DE COMPONENTES

```
┌─────────────────────────────────────────────────────────────────┐
│                         APP.JS                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    BrowserRouter                          │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │                 AuthProvider                        │  │  │
│  │  │  ┌───────────────────────────────────────────────┐  │  │  │
│  │  │  │              CartProvider                     │  │  │  │
│  │  │  │  ┌─────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │              NAVBAR                     │  │  │  │  │
│  │  │  │  ├─────────────────────────────────────────┤  │  │  │  │
│  │  │  │  │              ROUTES                     │  │  │  │  │
│  │  │  │  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │  │  │  │  │
│  │  │  │  │  │ Home │ │Catalog│ │Custom│ │ Cart │   │  │  │  │  │
│  │  │  │  │  └──────┘ └──────┘ └──────┘ └──────┘   │  │  │  │  │
│  │  │  │  │  ┌──────┐ ┌──────┐ ┌──────┐            │  │  │  │  │
│  │  │  │  │  │Check │ │ Track│ │Admin │            │  │  │  │  │
│  │  │  │  │  └──────┘ └──────┘ └──────┘            │  │  │  │  │
│  │  │  │  ├─────────────────────────────────────────┤  │  │  │  │
│  │  │  │  │              FOOTER                     │  │  │  │  │
│  │  │  │  └─────────────────────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

**Documento generado para LABCEL San Antonio**
**Versión 1.0 - Febrero 2026**
**Powered by Emergent AI**
