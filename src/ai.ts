/**
 * AI分析推荐服务
 */
import OpenAI from "openai";
import { config } from "./config";
import { WeatherData } from "./weather";

let openaiClient: OpenAI | null = null;

/**
 * 初始化OpenAI客户端
 */
function getOpenAIClient(): OpenAI | null {
  if (!config.ai.apiKey) {
    console.warn("⚠️ 未配置OpenAI API Key，将使用基础推荐");
    return null;
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: config.ai.apiKey,
    });
  }

  return openaiClient;
}

const getRes = async (prompt: string) => {
  console.log("🔍 AI API 配置检查:");
  console.log("  API Key 是否存在:", config.ai.apiKey ? "✅ 是" : "❌ 否");
  console.log("  API Key 长度:", config.ai.apiKey?.length || 0);
  console.log("  Model:", config.ai.model);
  console.log("  API URL: http://dap-new-api.lilithgames.com/v1/responses");

  if (!config.ai.apiKey) {
    throw new Error("API Key 未配置");
  }

  try {
    const response = await fetch(
      "http://dap-new-api.lilithgames.com/v1/responses",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.ai.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: config.ai.model,
          input: prompt,
        }),
      }
    );

    console.log("📡 API 响应状态:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API 请求失败:");
      console.error("  状态码:", response.status);
      console.error("  错误信息:", errorText);
      throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
    }

    return response;
  } catch (error: any) {
    console.error("❌ 网络请求错误:", error.message);
    if (error.cause) {
      console.error("  错误原因:", error.cause);
    }
    throw error;
  }
};

/**
 * 使用AI分析天气并生成个性化推荐
 */
export async function getAIRecommendation(
  weather: WeatherData
): Promise<string> {
  const client = getOpenAIClient();

  if (!client) {
    return getBasicRecommendation(weather);
  }

  try {
    const prompt = `你是一个贴心的午餐推荐助手。根据今天的天气情况，为用户推荐适合的外卖。

天气信息：
- 城市：${weather.city}
- 温度：${weather.temp}°C，体感温度：${weather.feelsLike}°C
- 天气状况：${weather.description}
- 相对湿度：${weather.rh}%
- 风力登记：${weather.windClass} 级

请根据这些天气信息，用中文生成一段温馨、有趣的午餐推荐，包括：
1. 根据天气推荐适合的食物类型（比如热汤、凉面、火锅等）
2. 推荐2-3个具体的外卖选择
3. 用轻松幽默的语气，不要太正式
4. 内容不要过长，控制在200字以内

回复格式：直接给出推荐内容，不要额外的格式标记。`;

    console.log("📝 发送 Prompt 到 AI API...");

    const res = await getRes(prompt);
    const data = await res.json();

    console.log("📥 API 响应数据:", JSON.stringify(data, null, 2));

    const result =
      (data as any)?.output?.find((item: any) => item.status === "completed")
        ?.content?.[0]?.text || "";

    if (!result) {
      console.warn("⚠️ AI 返回结果为空，使用基础推荐");
      return getBasicRecommendation(weather);
    }

    console.log("✅ AI 推荐生成成功，长度:", result.length);
    return result;

    //   model: config.ai.model,
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "你是一个贴心的午餐推荐助手，擅长根据天气情况推荐合适的外卖。",
    //     },
    //     {
    //       role: "user",
    //       content: prompt,
    //     },
    //   ],
    //   temperature: 0.8,
    //   max_tokens: 500,
    // });

    // const recommendation = completion.choices[0]?.message?.content || "";
    // return recommendation.trim() || getBasicRecommendation(weather);
  } catch (error: any) {
    console.error("❌ AI分析失败:", error.message);
    console.warn("⚠️ 使用基础推荐");
    return getBasicRecommendation(weather);
  }
}

/**
 * 基础推荐（当AI不可用时使用）
 */
function getBasicRecommendation(weather: WeatherData): string {
  const { temp, description } = weather;

  const recommendations: string[] = [];

  // 根据温度推荐
  if (temp < 10) {
    recommendations.push("🍲 热汤类：麻辣烫、小火锅、牛肉面");
    recommendations.push("🔥 热食类：盖饭、炒菜、汤面");
  } else if (temp > 30) {
    recommendations.push("🍜 清爽类：凉面、沙拉、寿司");
    recommendations.push("🥤 冷饮类：冰镇饮料、果汁、奶茶");
  } else {
    recommendations.push("🍱 盖饭类：各种盖饭、炒饭");
    recommendations.push("🍜 面食类：拉面、炒面、汤面");
    recommendations.push("🍔 快餐类：汉堡、炸鸡、披萨");
  }

  // 根据天气状况调整
  if (description.includes("雨")) {
    recommendations.push("💡 提示：今天有雨，建议选择配送快的商家");
  }

  return `根据今天的天气（${temp}°C，${description}），我为你推荐：\n\n${recommendations.join(
    "\n"
  )}\n\n祝你用餐愉快！😊`;
}
