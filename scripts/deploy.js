const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Preparando despliegue en Vercel...\n');

// Verificar que estamos en el directorio correcto
if (!fs.existsSync('package.json')) {
  console.error('❌ No se encontró package.json. Asegúrate de estar en el directorio del proyecto.');
  process.exit(1);
}

// Verificar que existe .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ No se encontró .env.local. Ejecuta primero: node scripts/setup-db.js');
  process.exit(1);
}

console.log('📋 Pasos para desplegar en Vercel:');
console.log('');
console.log('1. 🔗 Conectar repositorio a Vercel:');
console.log('   - Ve a https://vercel.com/');
console.log('   - Inicia sesión con tu cuenta de GitHub');
console.log('   - Haz clic en "New Project"');
console.log('   - Selecciona tu repositorio "code-map"');
console.log('   - Vercel detectará automáticamente que es un proyecto Next.js');
console.log('');
console.log('2. 🗄️  Configurar base de datos:');
console.log('   - En el dashboard de Vercel, ve a "Storage"');
console.log('   - Crea una nueva base de datos PostgreSQL');
console.log('   - Copia la URL de conexión');
console.log('');
console.log('3. 🔧 Configurar variables de entorno en Vercel:');
console.log('   - En tu proyecto de Vercel, ve a "Settings" > "Environment Variables"');
console.log('   - Añade las siguientes variables:');
console.log('     DATABASE_URL = [URL de tu base de datos PostgreSQL]');
console.log('     NEXTAUTH_URL = https://tu-app.vercel.app');
console.log('     NEXTAUTH_SECRET = [tu-secret-key]');
console.log('     GOOGLE_CLIENT_ID = [tu-google-client-id]');
console.log('     GOOGLE_CLIENT_SECRET = [tu-google-client-secret]');
console.log('');
console.log('4. 🚀 Desplegar:');
console.log('   - Haz commit y push de tus cambios a GitHub');
console.log('   - Vercel desplegará automáticamente');
console.log('   - O ejecuta: vercel --prod');
console.log('');
console.log('5. ✅ Verificar despliegue:');
console.log('   - Revisa los logs en Vercel');
console.log('   - Verifica que la aplicación funcione correctamente');
console.log('   - Prueba la funcionalidad de la base de datos');
console.log('');

// Verificar si Vercel CLI está instalado
try {
  execSync('vercel --version', { stdio: 'ignore' });
  console.log('✅ Vercel CLI está instalado');
  console.log('💡 Puedes ejecutar: vercel --prod');
} catch (error) {
  console.log('📦 Instalando Vercel CLI...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI instalado');
    console.log('💡 Ejecuta: vercel --prod');
  } catch (installError) {
    console.log('⚠️  No se pudo instalar Vercel CLI automáticamente');
    console.log('💡 Instala manualmente: npm install -g vercel');
  }
}

console.log('');
console.log('🎯 Opciones de base de datos recomendadas:');
console.log('');
console.log('🌐 Vercel Postgres (más fácil):');
console.log('   - Integrado directamente con Vercel');
console.log('   - Configuración automática');
console.log('   - Escalado automático');
console.log('');
console.log('☁️  Supabase (gratis):');
console.log('   - Plan gratuito generoso');
console.log('   - Dashboard web excelente');
console.log('   - API REST automática');
console.log('');
console.log('⚡ Neon (gratis):');
console.log('   - PostgreSQL serverless');
console.log('   - Muy rápido');
console.log('   - Plan gratuito generoso');
console.log('');
