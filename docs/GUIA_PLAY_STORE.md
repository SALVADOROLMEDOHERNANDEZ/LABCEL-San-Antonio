# Guia: LABCEL San Antonio en Google Play Store

## PASO 1: Instalar como PWA (Ya funciona)

Tu app YA es instalable desde Chrome:

**Android:**
1. Abre Chrome en tu telefono
2. Ve a tu URL desplegada (boton "Deploy" en Emergent)
3. Chrome muestra banner "Instalar LABCEL San Antonio"
4. Toca "Instalar" y listo

**iPhone/iPad:**
1. Abre Safari > ve a tu URL
2. Toca "Compartir" > "Agregar a Inicio" > "Agregar"

---

## PASO 2: Subir a Google Play Store (PWABuilder)

### Requisitos
- Cuenta Google Play Developer ($25 USD unica vez): https://play.google.com/console/signup
- Tu app desplegada en URL publica (boton "Deploy" en Emergent)

### Generar APK con PWABuilder (metodo mas facil)

1. **Despliega tu app** en Emergent (boton "Deploy") y copia la URL

2. **Abre PWABuilder**: https://www.pwabuilder.com

3. **Pega tu URL** y click "Start" - analizara tu PWA

4. **Click "Package for stores"** > selecciona **"Android"**

5. **Configura:**
   - Package Name: `com.labcel.sanantonio`
   - App Name: `LABCEL San Antonio`
   - Version: `1.0.0`
   - Signing Key: Genera nueva (GUARDA el .keystore)

6. **Click "Generate"** y descarga el ZIP

7. El ZIP contiene:
   - `app-release-bundle.aab` (para Play Store)
   - `app-release-signed.apk` (para probar en tu telefono)
   - `assetlinks.json` (para verificacion)

### Subir a Google Play Console

1. Ve a https://play.google.com/console
2. Crea nueva app con estos datos:
   - Nombre: **LABCEL San Antonio**
   - Descripcion: Tienda de fundas personalizadas para smartphones
   - Categoria: **Compras**
   - Idioma: Espanol (Mexico)
3. Sube el archivo `.aab`
4. Agrega capturas de pantalla (min 2, tamano 1080x1920)
5. Politica de privacidad: `TU_URL/privacidad`
6. Correo: labcelsanantonio@gmail.com
7. Envia para revision (tarda 1-3 dias)

### Configurar Asset Links (despues de generar APK)

PWABuilder te dara un SHA256 fingerprint.
El archivo `/.well-known/assetlinks.json` ya esta creado en tu app.
Solo reemplaza `REEMPLAZAR_CON_TU_FINGERPRINT` con el valor real.

---

## Datos para la Ficha de Play Store

| Campo | Valor |
|-------|-------|
| Nombre | LABCEL San Antonio |
| Package | com.labcel.sanantonio |
| Descripcion corta | Fundas personalizadas para tu smartphone |
| Categoria | Compras |
| Clasificacion | Para todos |
| Contacto | labcelsanantonio@gmail.com |
| Privacidad | TU_URL/privacidad |
