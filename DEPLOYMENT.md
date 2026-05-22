# 🚀 Guía de Deployment - Fudyfoods Dashboard

## 📋 Prerequisitos
- ✅ Proyecto en GitHub (público o privado)
- ✅ Base de datos Supabase configurada con tablas
- ✅ Vercel account (https://vercel.com)
- ✅ Railway account (https://railway.app)

---

## 🔐 **PASO 1: Variables de Entorno (IMPORTANTE)**

Asegúrate de que tus credenciales NO estén en el repo. Usa `.env.local` localmente:

**Backend** (`backend/.env.local`):
```
SUPABASE_URL=https://kjksocbfyxsqilxwryxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqa3NvY2JmeXhzcWlseHdyeXh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc2MDg4NywiZXhwIjoyMDkzMzM2ODg3fQ.RvMQG4ZOmU0WxFRSK7imatRkmoZyQGf9gcVhL90Eub0
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqa3NvY2JmeXhzcWlseHdyeXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NjA4ODcsImV4cCI6MjA5MzMzNjg4N30.-dlCd-0lH1HM5xxfg5rJ4ZTr8FxgToQaw5GatFfAW5c
OPENAI_API_KEY=sk-xxxxx
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=https://kjksocbfyxsqilxwryxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqa3NvY2JmeXhzcWlseHdyeXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NjA4ODcsImV4cCI6MjA5MzMzNjg4N30.-dlCd-0lH1HM5xxfg5rJ4ZTr8FxgToQaw5GatFfAW5c
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

---

## 🐙 **PASO 2: Push a GitHub**

```bash
cd /Users/Diego/Fudyfoods
git init
git add .
git commit -m "Initial commit: Fudyfoods Dashboard"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/fudyfoods.git
git push -u origin main
```

---

## 🎯 **PASO 3: Deploy BACKEND en Railway**

### 3.1 - Ve a https://railway.app

### 3.2 - Nuevo Proyecto
- Click **"New Project"**
- Click **"Deploy from GitHub"**
- Autoriza Railway en GitHub
- Selecciona tu repo **fudyfoods**

### 3.3 - Configurar Railway
Railway detectará Python automáticamente.

**Variables de Entorno:**
- Click en **"Variables"**
- Agrega estas variables:

```
SUPABASE_URL=https://kjksocbfyxsqilxwryxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqa3NvY2JmeXhzcWlseHdyeXh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc2MDg4NywiZXhwIjoyMDkzMzM2ODg3fQ.RvMQG4ZOmU0WxFRSK7imatRkmoZyQGf9gcVhL90Eub0
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqa3NvY2JmeXhzcWlseHdyeXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NjA4ODcsImV4cCI6MjA5MzMzNjg4N30.-dlCd-0lH1HM5xxfg5rJ4ZTr8FxgToQaw5GatFfAW5c
ENVIRONMENT=production
DEBUG=False
```

### 3.4 - Start Command
En **"Deployment"**, configura el comando:
```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Wait no, Railway lee de Procfile automáticamente. Debería ver:
```
web: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 3.5 - Deploy
- Click **"Deploy"**
- Espera ~2-3 minutos
- Obtendrás una URL como: `https://fudyfoods-production.up.railway.app`

**Copia esta URL**, la necesitarás para el frontend.

---

## 🎨 **PASO 4: Deploy FRONTEND en Vercel**

### 4.1 - Ve a https://vercel.com

### 4.2 - Nuevo Proyecto
- Click **"Add New Project"**
- Click **"Import Git Repository"**
- Selecciona tu repo **fudyfoods**

### 4.3 - Configurar
- **Framework**: Next.js (auto-detectado)
- **Root Directory**: `./frontend`
- Click **"Continue"**

### 4.4 - Environment Variables
Agrega estas variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://kjksocbfyxsqilxwryxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqa3NvY2JmeXhzcWlseHdyeXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NjA4ODcsImV4cCI6MjA5MzMzNjg4N30.-dlCd-0lH1HM5xxfg5rJ4ZTr8FxgToQaw5GatFfAW5c
NEXT_PUBLIC_BACKEND_URL=https://fudyfoods-production.up.railway.app
```

**IMPORTANTE**: La URL debe ser la que obtuviste de Railway.

### 4.5 - Deploy
- Click **"Deploy"**
- Espera ~3-5 minutos
- Obtendrás una URL como: `https://fudyfoods.vercel.app`

---

## ✅ **PASO 5: Verificar que todo funciona**

1. Abre `https://fudyfoods.vercel.app` en el navegador
2. Deberías ver el dashboard
3. Si ves datos, ¡FUNCIONA! ✅

---

## 🔄 **Auto-Deploy (Futuro)**

Cada vez que hagas `git push` a main:
- Railway auto-redeploya el backend
- Vercel auto-redeploya el frontend
- ¡Todo se actualiza automáticamente!

---

## 🆘 **Troubleshooting**

### Backend no conecta a Supabase
- Verifica que `SUPABASE_URL` y `SUPABASE_KEY` sean correctos en Railway
- En Railway, ve a **"Logs"** para ver errores

### Frontend no carga datos
- Verifica que `NEXT_PUBLIC_BACKEND_URL` apunte a la URL correcta de Railway
- Abre DevTools (F12) → Console para ver errores

### CORS Error
- El backend debe tener CORS habilitado para la URL de Vercel
- Ya está configurado en `main.py`

---

## 📝 **URLs Finales**

Una vez deployed:
- **Frontend**: `https://fudyfoods.vercel.app`
- **Backend**: `https://fudyfoods-production.up.railway.app`
- **API Docs**: `https://fudyfoods-production.up.railway.app/docs`
- **Base de Datos**: Supabase Console

---

**¿Necesitas ayuda en algún paso?** 🚀
