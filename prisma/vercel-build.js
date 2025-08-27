const { execSync } = require('child_process');

console.log('🚀 Iniciando build de Prisma para Vercel...');

try {
  // Verificar que estamos en Vercel
  if (process.env.VERCEL) {
    console.log('✅ Detectado entorno Vercel');
  } else {
    console.log('⚠️  No se detectó entorno Vercel');
  }

  // Generar el cliente de Prisma
  console.log('📦 Generando cliente de Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log('✅ Cliente de Prisma generado correctamente');

} catch (error) {
  console.error('❌ Error durante el build:', error.message);
  process.exit(1);
}
