const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando base de datos para API Sync Hub...\n');

// Verificar si existe .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creando archivo .env.local...');
  
  const envContent = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/api_sync_hub"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${Math.random().toString(36).substring(2, 15)}"

# Google OAuth (configurar después)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Vercel (configurar en producción)
# DATABASE_URL="postgresql://..."
# NEXTAUTH_URL="https://your-app.vercel.app"
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env.local creado');
  console.log('⚠️  IMPORTANTE: Configura DATABASE_URL con tus credenciales de PostgreSQL\n');
}

console.log('📋 Pasos para configurar la base de datos:');
console.log('');
console.log('1. 📊 Instalar PostgreSQL localmente o usar un servicio en la nube:');
console.log('   - Local: https://www.postgresql.org/download/');
console.log('   - Supabase (gratis): https://supabase.com/');
console.log('   - Neon (gratis): https://neon.tech/');
console.log('   - Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres');
console.log('');
console.log('2. 🔧 Actualizar DATABASE_URL en .env.local con tus credenciales');
console.log('');
console.log('3. 🗄️  Ejecutar los siguientes comandos:');
console.log('   npx prisma db push');
console.log('   npx prisma studio');
console.log('');
console.log('4. 🔐 Configurar Google OAuth (opcional):');
console.log('   - Ve a https://console.cloud.google.com/');
console.log('   - Crea un proyecto y configura OAuth 2.0');
console.log('   - Añade las credenciales a .env.local');
console.log('');
console.log('5. 🚀 Para desplegar en Vercel:');
console.log('   - Conecta tu repositorio a Vercel');
console.log('   - Configura las variables de entorno en Vercel');
console.log('   - Vercel detectará automáticamente que es un proyecto Next.js');
console.log('');
