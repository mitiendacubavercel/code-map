# API Sync Hub

Una aplicación web colaborativa tipo "pizarra digital" para sincronizar las necesidades entre desarrollador frontend y backend, eliminando la fricción en la documentación de APIs.

## 🚀 Características

### Funcionalidades Core

- **Gestión de Endpoints**: Visualización en cuadrícula con estados visuales
  - 🟢 Verde: Frontend y backend coinciden completamente
  - 🔴 Rojo: Hay discrepancias (mostrar diferencias específicas)
  - 🟡 Amarillo: Endpoint en progreso/pendiente
  - ⚪ Gris: No definido por alguna de las partes

- **Interfaz Dual**: Vista Frontend y Backend separadas con comparación automática
- **Persistencia de Datos**: Base de datos PostgreSQL con Prisma
- **Sincronización en tiempo real**: WebSockets para colaboración
- **Importación/Exportación**: Soporte para JSON, OpenAPI/Swagger, Postman

### Funcionalidades Adicionales

- **Colaboración**: Roles de usuario, comentarios, notificaciones
- **Validación Avanzada**: Schema validation, type checking, mock data
- **Integración**: GitHub, Postman, Swagger
- **UX/UI Avanzada**: Drag & drop, filtros, búsqueda, temas
- **Monitoreo**: Dashboard con métricas y reportes

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + Shadcn/ui
- **Base de datos**: Prisma + PostgreSQL
- **Autenticación**: NextAuth.js
- **Estado**: Zustand
- **Deploy**: Vercel

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd code-map
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar la base de datos**
   ```bash
   # Ejecutar el script de configuración automática
   node scripts/setup-db.js
   
   # Editar .env.local con tus credenciales de PostgreSQL
   ```

4. **Configurar la base de datos**
   ```bash
   # Generar el cliente de Prisma
   npx prisma generate
   
   # Ejecutar las migraciones
   npx prisma db push
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 🗄️ Configuración de la Base de Datos

### Opciones Recomendadas:

1. **Vercel Postgres** (más fácil para despliegue):
   - Integrado directamente con Vercel
   - Configuración automática
   - Escalado automático

2. **Supabase** (gratis):
   - Plan gratuito generoso
   - Dashboard web excelente
   - API REST automática

3. **Neon** (gratis):
   - PostgreSQL serverless
   - Muy rápido
   - Plan gratuito generoso

### PostgreSQL Local

1. **Instalar PostgreSQL**
   ```bash
   # En macOS con Homebrew
   brew install postgresql
   
   # En Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # En Windows, descargar desde postgresql.org
   
   # O usar Docker:
   docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
   ```

2. **Crear la base de datos**
   ```bash
   createdb api_sync_hub
   ```

### PostgreSQL en la Nube (Recomendado)

- **Neon**: https://neon.tech
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app

## 🔧 Configuración de OAuth (Opcional)

### Google OAuth

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un nuevo proyecto
3. Habilitar Google+ API
4. Crear credenciales OAuth 2.0
5. Agregar URLs de redirección:
   - `http://localhost:3000/api/auth/callback/google` (desarrollo)
   - `https://yourdomain.com/api/auth/callback/google` (producción)

## 📱 Uso de la Aplicación

### 1. Crear un Endpoint

1. Hacer clic en "Crear Endpoint"
2. Completar información básica (nombre, método, path)
3. Definir especificaciones Frontend y Backend
4. Guardar

### 2. Gestionar Especificaciones

- **Frontend**: Definir lo que necesita recibir
- **Backend**: Definir lo que puede entregar
- **Comparación**: La aplicación detecta automáticamente las diferencias

### 3. Resolver Conflictos

- Los conflictos se muestran visualmente
- Editar las especificaciones para resolver diferencias
- La aplicación actualiza el estado automáticamente

### 4. Colaborar

- Invitar miembros al proyecto
- Comentar en endpoints
- Ver actividad en tiempo real

## 🚀 Deploy

### Vercel (Recomendado)

1. **Preparar el despliegue**
   ```bash
   # Ejecutar el script de configuración
   node scripts/deploy.js
   ```

2. **Conectar repositorio a Vercel**
   - Ve a https://vercel.com/
   - Inicia sesión con tu cuenta de GitHub
   - Haz clic en "New Project"
   - Selecciona tu repositorio "code-map"
   - Vercel detectará automáticamente que es un proyecto Next.js

3. **Configurar base de datos**
   - En el dashboard de Vercel, ve a "Storage"
   - Crea una nueva base de datos PostgreSQL
   - Copia la URL de conexión

4. **Configurar variables de entorno en Vercel**
   - En tu proyecto de Vercel, ve a "Settings" > "Environment Variables"
   - Añade las siguientes variables:
     ```
     DATABASE_URL = [URL de tu base de datos PostgreSQL]
     NEXTAUTH_URL = https://tu-app.vercel.app
     NEXTAUTH_SECRET = [tu-secret-key]
     GOOGLE_CLIENT_ID = [tu-google-client-id]
     GOOGLE_CLIENT_SECRET = [tu-google-client-secret]
     ```

5. **Desplegar**
   ```bash
   # Opción 1: Despliegue automático desde GitHub
   git add .
   git commit -m "Initial deployment"
   git push origin main
   
   # Opción 2: Despliegue manual
   vercel --prod
   ```

### Otros Proveedores

- **Netlify**: Configurar build command y output directory
- **Railway**: Deploy automático desde GitHub
- **Heroku**: Usar buildpacks de Node.js

## 📊 Estructura del Proyecto

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Layout principal
│   ├── page.tsx        # Página principal
│   └── globals.css     # Estilos globales
├── components/         # Componentes React
│   ├── ui/            # Componentes base (shadcn/ui)
│   ├── endpoint-card.tsx
│   ├── endpoints-grid.tsx
│   ├── filters-bar.tsx
│   └── endpoint-modal.tsx
├── lib/               # Utilidades y configuración
│   ├── auth.ts        # Configuración NextAuth
│   ├── prisma.ts      # Cliente Prisma
│   ├── store.ts       # Store Zustand
│   └── utils.ts       # Utilidades
└── prisma/            # Esquema de base de datos
    └── schema.prisma
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisar la [documentación](docs/)
2. Buscar en [issues](https://github.com/username/code-map/issues)
3. Crear un nuevo issue con detalles del problema

## 🗺️ Roadmap

### Fase 1 - MVP ✅
- [x] CRUD básico de endpoints
- [x] Comparación simple
- [x] UI básica

### Fase 2 - Colaboración 🚧
- [ ] Multi-usuario
- [ ] Tiempo real
- [ ] Comentarios

### Fase 3 - Integración 📋
- [ ] Import/export
- [ ] Herramientas externas
- [ ] Webhooks

### Fase 4 - Analytics 📊
- [ ] Dashboard
- [ ] Métricas
- [ ] Reportes

### Fase 5 - Mobile 📱
- [ ] App nativa
- [ ] PWA
- [ ] Offline support
