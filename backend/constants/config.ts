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
