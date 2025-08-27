# 🚀 Deploy en Vercel - Configuración de Prisma

## 🎯 Problema Resuelto

**Error**: `PrismaClientInitializationError: Prisma has detected that this project was built on Vercel, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered.`

## ✅ Solución Implementada

### 1. **Script de Build Personalizado**
- **Comando local**: `npm run build` (sin Prisma generate)
- **Comando Vercel**: `npm run build:vercel` (con Prisma generate)

### 2. **Configuración de Vercel**
```json
{
  "buildCommand": "npm run build:vercel",
  "env": {
    "PRISMA_GENERATE_DATAPROXY": "true"
  }
}
```

### 3. **Esquema de Prisma Optimizado**
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "./generated/client"
}
```

## 🔧 Configuración Requerida

### **Variables de Entorno en Vercel**
```bash
# Base de datos PostgreSQL
DATABASE_URL="postgresql://username:password@host:port/database"

# Prisma
PRISMA_GENERATE_DATAPROXY="true"
```

### **Comandos de Build**
```bash
# Desarrollo local
npm run build

# Vercel (automático)
npm run build:vercel
```

## 📋 Pasos para el Deploy

### **1. Configurar Base de Datos**
- Crear base de datos PostgreSQL (puede ser en Vercel Postgres, Supabase, etc.)
- Obtener la URL de conexión

### **2. Configurar Variables de Entorno en Vercel**
- Ir a tu proyecto en Vercel Dashboard
- Settings → Environment Variables
- Agregar `DATABASE_URL` con tu conexión de PostgreSQL

### **3. Hacer Deploy**
```bash
# Push a GitHub
git add .
git commit -m "Fix Prisma build for Vercel"
git push origin main

# Vercel detectará automáticamente los cambios
```

## 🐛 Solución de Problemas

### **Error: Prisma Client no generado**
```bash
# Verificar que el build incluya prisma generate
npm run build:vercel
```

### **Error: Conexión a base de datos**
- Verificar `DATABASE_URL` en Vercel
- Verificar que la BD esté accesible desde Vercel
- Verificar firewall/seguridad de la BD

### **Error: Build falla en Vercel**
- Verificar que `buildCommand` esté configurado correctamente
- Verificar que no haya errores de TypeScript
- Verificar logs de build en Vercel Dashboard

## ✨ Beneficios de la Solución

1. **Build automático**: Prisma generate se ejecuta automáticamente en Vercel
2. **Cliente actualizado**: Siempre se usa la versión más reciente del cliente
3. **Deploy confiable**: No más errores de Prisma en producción
4. **Optimización**: Solo se genera en Vercel, no en desarrollo local

## 🔮 Próximos Pasos

1. **Base de datos**: Configurar PostgreSQL en Vercel o externo
2. **Variables de entorno**: Configurar en Vercel Dashboard
3. **Deploy**: Hacer push y verificar build
4. **Testing**: Verificar que los endpoints funcionen en producción

## 📚 Recursos Útiles

- [Prisma + Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [PostgreSQL en Vercel](https://vercel.com/docs/storage/vercel-postgres)
