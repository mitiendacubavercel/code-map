const { PrismaClient } = require('@prisma/client');

console.log('🔍 Probando conexión a la base de datos...\n');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('📡 Intentando conectar a la base de datos...');
    
    // Probar la conexión
    await prisma.$connect();
    console.log('✅ Conexión exitosa a la base de datos');
    
    // Probar una consulta simple
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Consulta de prueba exitosa:', result);
    
    console.log('\n🎉 La base de datos está funcionando correctamente!');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verifica que DATABASE_URL esté configurado correctamente en .env.local');
    console.log('2. Asegúrate de que la base de datos Neon esté activa');
    console.log('3. Verifica que la URL de conexión incluya los parámetros correctos');
    console.log('4. Si usas Neon, asegúrate de que el pooler esté habilitado');
    
    console.log('\n📋 Ejemplo de DATABASE_URL para Neon:');
    console.log('DATABASE_URL="postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require"');
    
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
