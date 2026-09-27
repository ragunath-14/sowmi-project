import pkg from "pg";
const { Pool } = pkg;

let pool;

const isLocalDb = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL || "");

export const connectToDatabase = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isLocalDb ? false : { rejectUnauthorized: false },
      family: 4
    });

    console.log("✅ PostgreSQL connected");
  }

  return pool;
};