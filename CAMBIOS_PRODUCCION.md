# Cambios necesarios para Hostinger (Producción)

## 1. Backend - Variables de ambiente (.env)

**Cambia esto en `backend/.env`:**
```dotenv
ENVIRONMENT=production
```

**En desarrollo está:**
```dotenv
ENVIRONMENT=development
```

---

## 2. Backend - CORS (server.py)

**Para Hostinger, actualiza los orígenes permitidos:**

Busca esta sección en `backend/server.py` (línea ~940):

```python
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

**Cámbialo a los dominios de Hostinger:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "https://tunominio.com",      # Tu dominio principal
        "https://www.tunominio.com",  # Con www
        "https://api.tunominio.com",  # Si tienes subdominio para API
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 3. Frontend - Variables de ambiente (.env)

**Cambia la URL del backend:**

De:
```env
REACT_APP_BACKEND_URL=http://192.168.1.83:8001
```

A:
```env
REACT_APP_BACKEND_URL=https://api.tunominio.com
# O si el backend está en el mismo hosting:
REACT_APP_BACKEND_URL=https://tunominio.com/api
```

---

## 4. Cookies en producción

El backend automáticamente detectará `ENVIRONMENT=production` y usará:
- `secure=True` (requiere HTTPS)
- `samesite="lax"` (requiere HTTPS válido)

**Esto es CORRECTO para producción.**

---

## 5. Base de datos MongoDB

Verifica que la conexión MongoDB siga siendo válida desde Hostinger:
```dotenv
MONGO_URL=mongodb+srv://labcel:14Bc3154n4n70n10@labcel.sv3acyl.mongodb.net/LABCEL?retryWrites=true&w=majority
```

**Es recomendable cambiar la contraseña** después de desplegarlo.

---

## 6. Build del Frontend

Antes de subir a Hostinger, ejecuta:
```powershell
cd frontend
npm run build
```

Esto crea una carpeta `build/` con los archivos optimizados.

---

## Resumen de archivos a cambiar:

- [ ] `backend/.env` - `ENVIRONMENT=production`
- [ ] `backend/server.py` - CORS con tus dominios
- [ ] `frontend/.env` - URL del backend en Hostinger
- [ ] Ejecutar `npm run build` en el frontend

**¿Cuál es tu dominio en Hostinger?** Te ayudaré a configurarlo exactamente.
