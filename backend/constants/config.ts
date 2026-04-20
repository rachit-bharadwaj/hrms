import "../utils/config";

export const PORT = process.env.PORT || 8000;

export const NODE_ENV = process.env.NODE_ENV || "development";

export const getTimestamp = () => {
  const date = new Date();
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  
  return formatter.format(date).replace(/,/g, "");
};

export const TIMESTAMP = getTimestamp();

export const API_VERSION = process.env.API_VERSION || "1.0.0";

export const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
  : "*";

export const DATABASE_URL = process.env.DATABASE_URL;

export const JWT_SECRET = process.env.JWT_SECRET || "harbor_secret_key_123";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

// SMTP Config
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;
export const SMTP_FROM = process.env.SMTP_FROM || '"Harbor HRMS" <noreply@harbor.com>';
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

