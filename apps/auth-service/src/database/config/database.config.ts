import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url:
    process.env.DATABASE_URL ||
    'postgresql://postgres:password@localhost:5432/jungle_db',
  entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false, // Importante: usar migrations, não synchronize
  logging: process.env.NODE_ENV === 'development',
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
