import { Pool } from "pg";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });
const pool = new Pool({
  user: process.env.POSTGRES_USER || "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  database: process.env.DB_NAME || "woridb",
  password: process.env.DB_PASSWORD || "Ma$$ichiara07",
  port: parseInt(process.env.DB_PORT || "5433", 10),
  ssl:  false,
});

export default pool;
