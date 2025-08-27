const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build de Prisma para Vercel...');

try {
  // Verificar que estamos en Vercel
  if (process.env.VERCEL) {
    console.log('✅ Detectado entorno Vercel');
  } else {
    console.log('⚠️  No se detectó entorno Vercel');
  }

  // Limpiar instalaciones previas
  console.log('🧹 Limpiando instalaciones previas...');
  const prismaDir = path.join(process.cwd(), 'node_modules', '.prisma');
  const prismaClientDir = path.join(process.cwd(), 'node_modules', '@prisma');
  
  if (fs.existsSync(prismaDir)) {
    fs.rmSync(prismaDir, { recursive: true, force: true });
    console.log('✅ Directorio .prisma limpiado');
  }
  
  if (fs.existsSync(prismaClientDir)) {
    fs.rmSync(prismaClientDir, { recursive: true, force: true });
    console.log('✅ Directorio @prisma limpiado');
  }

  // Generar el cliente de Prisma
  console.log('📦 Generando cliente de Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Verificar que se generó correctamente
  if (!fs.existsSync(prismaDir)) {
    throw new Error('No se pudo generar el cliente de Prisma');
  }

  console.log('✅ Cliente de Prisma generado correctamente');
  
  // Verificar la estructura
  console.log('🔍 Estructura del cliente generado:');
  const files = fs.readdirSync(prismaDir, { recursive: true });
  console.log(files);

} catch (error) {
  console.error('❌ Error durante el build:', error.message);
  process.exit(1);
}
