/**
 * 配置文件
 */
import dotenv from "dotenv";

dotenv.config();

export const config = {
  // 飞书配置（使用 webhook 方式）
  feishu: {
    webhookUrl: process.env.FEISHU_WEBHOOK_URL || "",
  },

  // 天气配置
  weather: {
    apiKey: process.env.WEATHER_API_KEY || "",
    city: process.env.WEATHER_CITY || "Shanghai",
    lat: process.env.WEATHER_LAT || "31.163273",
    lon: process.env.WEATHER_LON || "121.389084",
  },

  // AI配置
  ai: {
    apiKey: process.env.NEWAPI_TOKEN || "",
    model: process.env.NEWAPI_MODEL || "gpt-3.5-turbo",
  },

  // 提醒时间配置
  reminder: {
    hour: parseInt(process.env.REMINDER_HOUR || "11", 10),
    minute: parseInt(process.env.REMINDER_MINUTE || "15", 10),
  },
};
