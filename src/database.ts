import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  password: "alex123",
  host: "localhost",
  port: 5432,
  database: "messenger",
});

export default pool;
