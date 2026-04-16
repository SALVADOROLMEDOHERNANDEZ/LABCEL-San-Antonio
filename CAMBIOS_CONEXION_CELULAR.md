# Cambios realizados para conexión exitosa del Celular

## Problema original
La aplicación funcionaba en `localhost:3000` pero no en el celular porque:
- El backend no escuchaba en todas las interfaces (0.0.0.0)
- CORS no permitía múltiples orígenes
- Las cookies de sesión no se enviaban correctamente entre diferentes dispositivos

---

## 1. Frontend - Actualizar URL del Backend

**Archivo:** `frontend/.env`

```env
# ANTES:
REACT_APP_BACKEND_URL=http://localhost:8001

# DESPUÉS:
REACT_APP_BACKEND_URL=http://192.168.1.83:8001
```

**¿Por qué?** 
- `localhost` solo funciona en la máquina local
- `192.168.1.83` es la IP local, accesible desde dispositivos en la red WiFi

---

## 2. Backend - Agregar variable ENVIRONMENT

**Archivo:** `backend/.env`

```env
# Agregar esta línea:
ENVIRONMENT=development
```

---

## 3. Backend - Detectar ambiente en server.py

**Archivo:** `backend/server.py` (línea ~22)

```python
# Agregar después de las importaciones:

# Environment configuration
ENVIRONMENT = os.environ.get('ENVIRONMENT', 'production')
IS_DEVELOPMENT = ENVIRONMENT == 'development'
```

---

## 4. Backend - Actualizar CORS

**Archivo:** `backend/server.py` (línea ~930)

```python
# ANTES:
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# DESPUÉS:
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.1.83:3000",
        "http://192.168.1.83:8001",
        "http://localhost:8001",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**¿Por qué?**
- `allow_credentials=True` + `allow_origins=["*"]` causa conflictos CORS
- Debe especificar exactamente qué orígenes son permitidos
- Incluye: localhost (PC) e IP local (celular)

---

## 5. Backend - Cookies dinámicas según ambiente

**Archivo:** `backend/server.py` (línea ~355)

```python
# En el endpoint /auth/session, cambiar:

# ANTES:
response.set_cookie(
    key="session_token",
    value=session_token,
    httponly=True,
    secure=True,
    samesite="none",
    path="/",
    max_age=7 * 24 * 60 * 60
)

# DESPUÉS:
# Configure cookie based on environment
if IS_DEVELOPMENT:
    # Development: allow HTTP, lax samesite
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
else:
    # Production: secure cookies over HTTPS
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="lax",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
```

**¿Por qué?**
- En desarrollo: `secure=False` para HTTP, `samesite="lax"` permite cookies
- En producción: `secure=True` para HTTPS requerido

---

## 6. Backend - Devolver token en respuesta

**Archivo:** `backend/server.py` (línea ~355)

```python
# ANTES:
user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
response = JSONResponse(content=user)

# DESPUÉS:
user = await db.users.find_one({"user_id": user_id}, {"_id": 0})

# Add token to response for client-side storage
user_with_token = {**user, "session_token": session_token}

response = JSONResponse(content=user_with_token)
```

**¿Por qué?**
- El cliente puede guardar el token en sessionStorage
- Permite mantener sesión sin depender solo de cookies (crucial para desarrollo)

---

## 7. Frontend - Interceptor de Axios

**Archivo:** `frontend/src/App.js`

```javascript
// ANTES:
export const apiClient = axios.create({
  baseURL: API,
  withCredentials: true,
});

// DESPUÉS:
export const apiClient = axios.create({
  baseURL: API,
  withCredentials: true,
});

// Add interceptor to include token in Authorization header if available
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('session_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**¿Por qué?**
- Envía el token en el header `Authorization` como fallback
- Si la cookie no se envía, el header lo hace
- Garantiza que `get_current_user()` siempre encuentre el token

---

## 8. Frontend - Guardar token en sessionStorage

**Archivo:** `frontend/src/components/AuthCallback.js`

```javascript
// ANTES:
const response = await apiClient.post('/auth/session', {
  session_id: sessionId
});
updateUser(response.data);

// DESPUÉS:
const response = await apiClient.post('/auth/session', {
  session_id: sessionId
});

// Store token in sessionStorage for fallback
if (response.data.session_token) {
  sessionStorage.setItem('session_token', response.data.session_token);
}

updateUser(response.data);
```

**¿Por qué?**
- Persiste el token en el navegador
- El interceptor de axios lo usa para futuras peticiones
- Funciona como respaldo cuando las cookies no son suficientes

---

## 9. Frontend - Recuperar token en AuthContext

**Archivo:** `frontend/src/context/AuthContext.js`

```javascript
// ANTES:
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

// DESPUÉS:
const checkAuth = async () => {
  try {
    // Try to get token from sessionStorage (fallback for development)
    const token = sessionStorage.getItem('session_token');
    if (token) {
      // Token exists, axios interceptor will use it
    }
    
    const response = await apiClient.get('/auth/me');
    setUser(response.data);
  } catch (error) {
    setUser(null);
  } finally {
    setLoading(false);
  }
};
```

**¿Por qué?**
- Al cargar la app, verifica si existe token en sessionStorage
- El interceptor lo envía automáticamente en las peticiones

---

## 10. Frontend - Limpiar token en logout

**Archivo:** `frontend/src/context/AuthContext.js`

```javascript
// ANTES:
const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
    setUser(null);
    window.location.href = '/';
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// DESPUÉS:
const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
    sessionStorage.removeItem('session_token');
    setUser(null);
    window.location.href = '/';
  } catch (error) {
    console.error('Logout error:', error);
  }
};
```

**¿Por qué?**
- Elimina el token cuando el usuario hace logout
- Evita que se use un token expirado

---

## 11. Ejecutar backend en 0.0.0.0

**Comando en terminal:**

```powershell
# Antes (solo localhost):
python -m uvicorn server:app --reload

# Después (todas las interfaces):
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**¿Por qué?**
- `0.0.0.0` hace que escuche en TODAS las direcciones IP de la máquina
- Permite que otros dispositivos (celular) se conecten

---

## Resumen de lo que permite la conexión del celular:

| Componente | Cambio | Beneficio |
|-----------|--------|-----------|
| **Backend listen** | `--host 0.0.0.0` | Escucha en todas las interfaces |
| **Frontend .env** | URL con IP local | Apunta al backend correcto |
| **Backend CORS** | Múltiples orígenes | Acepta peticiones desde celular |
| **Cookies dinámicas** | `secure=False` en desarrollo | Funciona con HTTP |
| **Token en sessionStorage** | Guardar token cliente | Fallback cuando cookies fallan |
| **Interceptor axios** | Enviar token en header | Garantiza autenticación |

---

## Para llevar a Producción (Hostinger):

1. Cambiar `ENVIRONMENT=production` en `backend/.env`
2. Actualizar CORS con tu dominio HTTPS
3. Actualizar `frontend/.env` con URL HTTPS del backend
4. Las cookies automáticamente serán `secure=True, samesite="lax"`

✅ **Así es como funciona en celular Y en PC** 🚀
