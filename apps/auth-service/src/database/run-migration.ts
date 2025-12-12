import { DataSource } from 'typeorm';
import { dataSourceOptions } from './config/database.config';

async function runMigration() {
  try {
    const dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    console.log('🔄 Executando migration...');

    // Criar tabela users
    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        email varchar NOT NULL,
        password varchar NOT NULL,
        name varchar NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT UQ_fe0bb3f6920c5d7b9db7b7e8b7a UNIQUE (email),
        CONSTRAINT PK_a3ffb1c0c8416b9fc6f907b7433 PRIMARY KEY (id)
      );
    `);

    console.log('✅ Tabela users criada com sucesso!');

    await dataSource.destroy();
    console.log('🔌 Conexão fechada!');
  } catch (error) {
    console.error('❌ Erro ao executar migration:', (error as Error).message);
    process.exit(1);
  }
}

runMigration();
