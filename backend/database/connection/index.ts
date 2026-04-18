import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DATABASE_URL } from "../../constants/config";

let cached = (global as any).drizzle || { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) {
    console.log("Using cached DB connection");
    return cached.conn;
  }

  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is missing in the environment variables");
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      const pool = new Pool({
        connectionString: DATABASE_URL,
      });

      const db = drizzle(pool);
      return db;
    })();
  }

  cached.conn = await cached.promise;
  console.log("New DB connection created");
  return cached.conn;
};

export default connectDB;
