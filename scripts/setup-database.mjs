/**
 * Script de configuração do banco de dados PostgreSQL
 * Cria o banco de dados e usuário dedicado para o projeto do fórum
 */

import pg from 'pg';

const { Client } = pg;

// Configurações do servidor PostgreSQL (Coolify)
const POSTGRES_HOST = 'mkdls.space';
const POSTGRES_PORT = 3000;
const POSTGRES_ADMIN_USER = 'postgres';
const POSTGRES_ADMIN_PASSWORD = 'Amt7rNplcaSBGUf40D3Yt7Y8ScjQvMsveGCBkST2tR6JqCxKM46k77W9CzoVDxZ2';

// Configurações do banco do fórum
const FORUM_DB_NAME = 'forum_educacao';
const FORUM_DB_USER = 'forum_user';
const FORUM_DB_PASSWORD = 'ForumEdu2026_SecurePass!';

async function setupDatabase() {
  console.log('🔌 Conectando ao PostgreSQL no Coolify...');
  console.log(`   Host: ${POSTGRES_HOST}:${POSTGRES_PORT}`);

  const client = new Client({
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    user: POSTGRES_ADMIN_USER,
    password: POSTGRES_ADMIN_PASSWORD,
    database: 'postgres',
    ssl: false,
    connectionTimeoutMillis: 10000,
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL!\n');

    // Verificar versão
    const versionResult = await client.query('SELECT version()');
    console.log('📊 Versão:', versionResult.rows[0].version.split(' ').slice(0, 2).join(' '));

    // 1. Criar usuário dedicado (se não existir)
    console.log(`\n🔐 Criando usuário "${FORUM_DB_USER}"...`);
    try {
      await client.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${FORUM_DB_USER}') THEN
            CREATE USER ${FORUM_DB_USER} WITH PASSWORD '${FORUM_DB_PASSWORD}';
            RAISE NOTICE 'Usuário criado com sucesso';
          ELSE
            ALTER USER ${FORUM_DB_USER} WITH PASSWORD '${FORUM_DB_PASSWORD}';
            RAISE NOTICE 'Senha do usuário atualizada';
          END IF;
        END
        $$;
      `);
      console.log(`   ✅ Usuário "${FORUM_DB_USER}" configurado`);
    } catch (err) {
      console.log(`   ⚠️  Erro ao criar usuário: ${err.message}`);
    }

    // 2. Criar banco de dados (se não existir)
    console.log(`\n📁 Criando banco de dados "${FORUM_DB_NAME}"...`);
    const dbExists = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [FORUM_DB_NAME]
    );

    if (dbExists.rows.length === 0) {
      await client.query(`CREATE DATABASE ${FORUM_DB_NAME} OWNER ${FORUM_DB_USER}`);
      console.log(`   ✅ Banco "${FORUM_DB_NAME}" criado com sucesso`);
    } else {
      console.log(`   ℹ️  Banco "${FORUM_DB_NAME}" já existe`);
      // Garantir que o owner está correto
      await client.query(`ALTER DATABASE ${FORUM_DB_NAME} OWNER TO ${FORUM_DB_USER}`);
    }

    // 3. Conceder privilégios
    console.log(`\n🔑 Configurando privilégios...`);
    await client.query(`GRANT ALL PRIVILEGES ON DATABASE ${FORUM_DB_NAME} TO ${FORUM_DB_USER}`);
    console.log(`   ✅ Privilégios concedidos ao usuário "${FORUM_DB_USER}"`);

    // Fechar conexão com postgres e reconectar no novo banco para configurar schema
    await client.end();

    const forumClient = new Client({
      host: POSTGRES_HOST,
      port: POSTGRES_PORT,
      user: POSTGRES_ADMIN_USER,
      password: POSTGRES_ADMIN_PASSWORD,
      database: FORUM_DB_NAME,
      ssl: false,
    });

    await forumClient.connect();

    // Conceder privilégios no schema public
    await forumClient.query(`GRANT ALL ON SCHEMA public TO ${FORUM_DB_USER}`);
    await forumClient.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${FORUM_DB_USER}`);
    await forumClient.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${FORUM_DB_USER}`);

    console.log(`   ✅ Privilégios no schema public configurados`);

    await forumClient.end();

    // 4. Mostrar URL de conexão
    console.log('\n' + '='.repeat(60));
    console.log('✅ CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('='.repeat(60));
    console.log('\n📋 DATABASE_URL para o .env:\n');
    console.log(`DATABASE_URL="postgresql://${FORUM_DB_USER}:${FORUM_DB_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${FORUM_DB_NAME}"`);
    console.log('\n' + '='.repeat(60));
    console.log('\n📌 Próximos passos:');
    console.log('   1. Atualize o arquivo .env com a DATABASE_URL acima');
    console.log('   2. Execute: npx prisma migrate dev');
    console.log('   3. Execute: npx prisma db seed');
    console.log('');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Não foi possível conectar ao PostgreSQL.');
      console.error('   Verifique se:');
      console.error('   - O PostgreSQL está rodando no Coolify');
      console.error('   - A porta 3000 está exposta publicamente');
      console.error('   - O firewall permite conexões na porta 3000');
    }
    process.exit(1);
  } finally {
    try {
      await client.end();
    } catch {}
  }
}

setupDatabase();
