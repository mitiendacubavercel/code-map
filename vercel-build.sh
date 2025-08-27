#!/bin/bash

# Script de build para Vercel
echo "🚀 Iniciando build en Vercel..."

# Generar el cliente de Prisma
echo "📦 Generando cliente de Prisma..."
npx prisma generate

# Verificar que se generó correctamente
if [ ! -d "node_modules/.prisma" ]; then
    echo "❌ Error: No se pudo generar el cliente de Prisma"
    exit 1
fi

echo "✅ Cliente de Prisma generado correctamente"

# Construir la aplicación
echo "🔨 Construyendo aplicación Next.js..."
npm run build

echo "🎉 Build completado exitosamente!"
