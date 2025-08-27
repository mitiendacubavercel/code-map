#!/bin/bash

# Script de build para Vercel
echo "🚀 Iniciando build en Vercel..."

# Verificar que estamos en Vercel
if [ -n "$VERCEL" ]; then
    echo "✅ Detectado entorno Vercel"
else
    echo "⚠️  No se detectó entorno Vercel"
fi

# Limpiar instalaciones previas de Prisma
echo "🧹 Limpiando instalaciones previas de Prisma..."
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma

# Reinstalar dependencias si es necesario
echo "📦 Verificando dependencias..."
npm install

# Generar el cliente de Prisma
echo "📦 Generando cliente de Prisma..."
npx prisma generate

# Verificar que se generó correctamente
if [ ! -d "node_modules/.prisma" ]; then
    echo "❌ Error: No se pudo generar el cliente de Prisma"
    exit 1
fi

echo "✅ Cliente de Prisma generado correctamente"

# Verificar la estructura del cliente generado
echo "🔍 Verificando estructura del cliente..."
ls -la node_modules/.prisma/
ls -la node_modules/@prisma/

# Construir la aplicación
echo "🔨 Construyendo aplicación Next.js..."
npm run build

echo "🎉 Build completado exitosamente!"
