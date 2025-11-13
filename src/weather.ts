/**
 * 天气API服务
 */
import axios from "axios";
import { config } from "./config";

export interface WeatherData {
  temp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  city: string;
}

/**
 * 获取当前天气信息
 */
export async function getWeather(): Promise<WeatherData | null> {
  try {
    const apiKey = config.weather.apiKey;
    const lat = config.weather.lat;
    const lon = config.weather.lon;

    if (!apiKey) {
      console.warn("⚠️ 未配置天气API Key，将使用模拟数据");
      return getMockWeather();
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=zh_cn`;

    const response = await axios.get(url);
    const data = response.data;

    return {
      temp: Math.round(data.main.temp),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind?.speed || 0,
      city: data.name || config.weather.city,
    };
  } catch (error: any) {
    console.error("❌ 获取天气信息失败:", error.message);
    console.warn("⚠️ 使用模拟天气数据");
    return getMockWeather();
  }
}

/**
 * 获取模拟天气数据（用于测试或API不可用时）
 */
function getMockWeather(): WeatherData {
  const descriptions = ["晴天", "多云", "小雨", "阴天"];
  const randomDesc =
    descriptions[Math.floor(Math.random() * descriptions.length)];
  const randomTemp = Math.floor(Math.random() * 15) + 15; // 15-30度

  return {
    temp: randomTemp,
    description: randomDesc,
    humidity: Math.floor(Math.random() * 40) + 40,
    windSpeed: Math.random() * 5,
    city: config.weather.city,
  };
}

/**
 * 根据天气生成推荐提示
 */
export function getWeatherRecommendation(weather: WeatherData): string {
  const { temp, description } = weather;

  let recommendation = "";

  if (temp < 10) {
    recommendation =
      "天气较冷，建议点一些热汤类或火锅类的外卖，比如麻辣烫、小火锅、热汤面等，可以暖暖身子！";
  } else if (temp < 20) {
    recommendation = "天气凉爽，可以点一些温热的食物，比如盖饭、炒菜、汤面等。";
  } else if (temp > 30) {
    recommendation =
      "天气炎热，建议点一些清爽的食物，比如凉面、沙拉、冷饮、寿司等，或者来点冰镇饮料！";
  } else {
    recommendation = "天气舒适，可以根据个人喜好选择各种美食！";
  }

  if (description.includes("雨")) {
    recommendation +=
      " 今天有雨，建议点外卖时选择配送时间较短的商家，避免等待太久。";
  }

  return recommendation;
}
