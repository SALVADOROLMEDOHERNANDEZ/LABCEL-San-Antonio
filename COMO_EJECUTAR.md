# Cómo ejecutar la aplicación para acceder desde el celular

## Tu IP Local
**192.168.1.83**

---

## 1. Iniciar el Backend (Python/FastAPI)

### Paso 1: Abre PowerShell y navega a la carpeta del backend
```powershell
cd c:\Users\olmed\Downloads\LABCEL-San-Antonio\backend
```

### Paso 2: Activa el entorno virtual
```powershell
.\env\Scripts\Activate.ps1
```

### Paso 3: Ejecuta el servidor escuchando en TODAS las interfaces
```powershell
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Explicación:**
- `--host 0.0.0.0`: Permite que el servidor escuche en TODAS las direcciones IP (local + red)
- `--port 8001`: Puerto en el que escucha
- `--reload`: Recarga automática al cambiar código

---

## 2. Iniciar el Frontend (React)

### En otra ventana PowerShell:
```powershell
cd c:\Users\olmed\Downloads\LABCEL-San-Antonio\frontend
npm start
```

---

## 3. Acceder desde el celular

**En el celular (misma red WiFi):**
```
http://192.168.1.83:3000
```

---

## Checklist:
- ✅ Backend: http://192.168.1.83:8001
- ✅ Frontend: http://192.168.1.83:3000
- ✅ El .env del frontend ya tiene la IP correcta
- ✅ CORS está habilitado en el backend
- ✅ El servidor escucha en 0.0.0.0 (todas las interfaces)

---

## Si algo no funciona:

1. **Verifica que estén en la misma red WiFi**
2. **Desactiva el firewall temporalmente** o permite los puertos 8001 y 3000
3. **Prueba en desktop primero:** http://192.168.1.83:3000
4. **Revisa la consola del navegador** (F12) para errores de conexión
