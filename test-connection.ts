// Script para testar conexão com banco
import { DataSource } from "typeorm";

const dataSource = new DataSource({
  type: "postgres",
  url:
    process.env.DATABASE_URL ||
    "postgresql://postgres:password@localhost:5432/jungle_db",
  entities: [], // Sem entidades para teste
  synchronize: false,
  logging: true,
});

async function testConnection() {
  try {
    await dataSource.initialize();
    console.log("✅ Conexão com banco estabelecida com sucesso!");

    // Testar query simples
    const result = await dataSource.query("SELECT NOW() as current_time");
    console.log("🕒 Hora do servidor:", result[0].current_time);

    // Fechar conexão
    await dataSource.destroy();
    console.log("🔌 Conexão fechada com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar com banco:", (error as Error).message);
    process.exit(1);
  }
}

// Executar teste
testConnection();
