const fs = require('fs');
const path = require('path');

console.log('⚡ Configurando base de datos Neon...\n');

console.log('📋 Pasos para crear una nueva base de datos Neon:');
console.log('');
console.log('1. 🌐 Ve a https://neon.tech/');
console.log('2. 🔐 Inicia sesión o crea una cuenta');
console.log('3. ➕ Haz clic en "Create New Project"');
console.log('4. 📝 Completa la información:');
console.log('   - Project Name: api-sync-hub');
console.log('   - Database Name: neondb');
console.log('   - Region: Elige el más cercano a ti');
console.log('   - Compute: Free tier');
console.log('');
console.log('5. 🔑 Después de crear el proyecto:');
console.log('   - Ve a "Connection Details"');
console.log('   - Selecciona "Pooler" en lugar de "Direct connection"');
console.log('   - Copia la URL de conexión');
console.log('');
console.log('6. 🔧 Actualiza tu archivo .env.local:');
console.log('   - Reemplaza DATABASE_URL con la nueva URL de Neon');
console.log('   - Asegúrate de que incluya ?sslmode=require al final');
console.log('');
console.log('7. 🗄️  Sincroniza la base de datos:');
console.log('   npx prisma db push');
console.log('');

// Verificar si existe .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('neon.tech')) {
    console.log('⚠️  Ya tienes una URL de Neon configurada en .env.local');
    console.log('💡 Si la base de datos no funciona, crea una nueva en Neon');
  } else {
    console.log('✅ Archivo .env.local encontrado');
    console.log('💡 Actualiza DATABASE_URL con tu nueva URL de Neon');
  }
} else {
  console.log('❌ No se encontró .env.local');
  console.log('💡 Ejecuta primero: node scripts/setup-db.js');
}

console.log('');
console.log('🎯 Alternativas si Neon no funciona:');
console.log('');
console.log('☁️  Supabase (gratis):');
console.log('   - Ve a https://supabase.com/');
console.log('   - Crea un nuevo proyecto');
console.log('   - Usa la URL de conexión PostgreSQL');
console.log('');
console.log('🌐 Vercel Postgres:');
console.log('   - Integrado con Vercel');
console.log('   - Configuración automática');
console.log('   - Más fácil para despliegue');
console.log('');
console.log('🐘 PostgreSQL Local:');
console.log('   - Instala PostgreSQL localmente');
console.log('   - DATABASE_URL="postgresql://username:password@localhost:5432/api_sync_hub"');
console.log('');
