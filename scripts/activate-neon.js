const { PrismaClient } = require('@prisma/client');

console.log('⚡ Activando base de datos Neon...\n');

console.log('📋 La base de datos Neon está en estado IDLE (suspendida)');
console.log('🔧 Para activarla:');
console.log('');
console.log('1. 🌐 Ve a https://console.neon.tech/');
console.log('2. 🔐 Inicia sesión en tu cuenta');
console.log('3. 📊 Selecciona tu proyecto "api-sync-hub"');
console.log('4. 🔄 En el dashboard, busca el botón "Resume" o "Activate"');
console.log('5. ⏱️  Espera unos segundos a que se active');
console.log('');
console.log('💡 Alternativamente, puedes:');
console.log('   - Hacer una consulta SQL desde el dashboard de Neon');
console.log('   - Usar el SQL Editor para ejecutar: SELECT 1;');
console.log('   - Esto activará automáticamente la base de datos');
console.log('');

console.log('🎯 Una vez activada, prueba la conexión:');
console.log('   node scripts/test-db.js');
console.log('');

console.log('📝 Si necesitas crear un nuevo proyecto:');
console.log('   1. Ve a https://neon.tech/');
console.log('   2. Crea un nuevo proyecto');
console.log('   3. Usa la nueva URL de conexión');
console.log('');

// Intentar conectar para ver si ya está activa
async function tryConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Probando conexión actual...');
    await prisma.$connect();
    console.log('✅ ¡La base de datos ya está activa!');
    console.log('🎉 Puedes proceder con: npx prisma db push');
  } catch (error) {
    console.log('❌ Base de datos aún no está activa');
    console.log('💡 Sigue los pasos anteriores para activarla');
  } finally {
    await prisma.$disconnect();
  }
}

tryConnection();
