# Configuración de la Base de Datos - Solución al Problema de Persistencia

## 🚨 Problema Identificado

**El issue es que los endpoints no se guardan en la base de datos y se eliminan al actualizar la página.**

### Causas:
1. **Solo localStorage**: El store de Zustand solo estaba guardando en localStorage del navegador
2. **Sin conexión a BD**: No había integración con la base de datos PostgreSQL configurada
3. **Datos temporales**: Los endpoints se perdían al actualizar porque no había sincronización con el backend

## ✅ Solución Implementada

### 1. API Routes Creados
- `POST /api/endpoints` - Crear endpoints
- `GET /api/endpoints` - Obtener todos los endpoints
- `PUT /api/endpoints/[id]` - Actualizar endpoints
- `DELETE /api/endpoints/[id]` - Eliminar endpoints
- `POST /api/init` - Inicializar proyecto por defecto

### 2. Store Actualizado
- Integración con la API de la base de datos
- Mantiene localStorage como fallback
- Sincronización automática al cargar la página

### 3. Componentes Actualizados
- `EndpointModal` ahora usa la API
- `HomePage` carga endpoints desde la BD al inicializar
- Indicadores de carga y manejo de errores

## 🚀 Pasos para Configurar

### 1. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Base de datos PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/code_map_db"

# NextAuth (opcional)
NEXTAUTH_SECRET="tu-secret-key-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Configurar la Base de Datos
```bash
# Generar el cliente de Prisma
npm run db:generate

# Crear/actualizar la base de datos
npm run db:push

# O si prefieres usar migraciones
npm run db:migrate
```

### 3. Inicializar con Datos de Ejemplo
```bash
# Crear proyecto por defecto y endpoints de ejemplo
npm run db:init
```

### 4. Verificar la Base de Datos
```bash
# Abrir Prisma Studio para ver los datos
npm run db:studio
```

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Base de datos
npm run db:generate    # Generar cliente Prisma
npm run db:push        # Sincronizar esquema
npm run db:migrate     # Ejecutar migraciones
npm run db:studio      # Abrir interfaz de BD
npm run db:init        # Inicializar con datos

# Build y producción
npm run build
npm run start
```

## 📊 Estructura de la Base de Datos

- **Project**: Proyectos que contienen endpoints
- **Endpoint**: Endpoints de la API
- **EndpointSpec**: Especificaciones frontend/backend
- **Parameter**: Parámetros de los endpoints
- **Header**: Headers HTTP
- **StatusCode**: Códigos de estado y respuestas
- **Conflict**: Conflictos entre especificaciones

## 🎯 Flujo de Datos

1. **Usuario crea endpoint** → Se guarda en la BD via API
2. **Página se carga** → Se recuperan endpoints desde la BD
3. **Datos persistentes** → Se mantienen entre recargas de página
4. **Sincronización** → Frontend y BD siempre sincronizados

## 🐛 Solución de Problemas

### Error de Conexión a BD
- Verificar que PostgreSQL esté corriendo
- Verificar la URL de conexión en `.env.local`
- Ejecutar `npm run db:generate` y `npm run db:push`

### Endpoints no se cargan
- Verificar la consola del navegador para errores
- Verificar que la API esté funcionando en `/api/endpoints`
- Verificar que la BD tenga datos

### Errores de Prisma
- Ejecutar `npm run db:generate` para regenerar el cliente
- Verificar que el esquema esté sincronizado con `npm run db:push`

## ✨ Beneficios de la Solución

1. **Persistencia real**: Los datos se guardan en PostgreSQL
2. **Sincronización**: Frontend y BD siempre sincronizados
3. **Escalabilidad**: Puede manejar múltiples usuarios y proyectos
4. **Backup**: Los datos están seguros en la BD
5. **Colaboración**: Múltiples desarrolladores pueden trabajar en el mismo proyecto

## 🔮 Próximos Pasos

1. **Autenticación**: Implementar login con NextAuth
2. **Proyectos múltiples**: Permitir crear/editar proyectos
3. **Colaboración en tiempo real**: Usar Socket.io para cambios en vivo
4. **Importación/Exportación**: Soporte para OpenAPI/Swagger
5. **Testing**: Tests unitarios y de integración
