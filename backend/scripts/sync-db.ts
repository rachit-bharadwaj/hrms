import connectDB from "../database/connection";
import { sql } from "drizzle-orm";

async function sync() {
  console.log("🔄 Synchronizing database schema...");
  const db = await connectDB();
  try {
    // Add must_change_password to users
    await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT FALSE NOT NULL`);
    console.log("✅ Column 'must_change_password' ensured in 'users' table.");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Sync failed:", error);
    process.exit(1);
  }
}

sync();
