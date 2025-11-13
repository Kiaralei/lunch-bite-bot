/**
 * 飞书机器人消息发送（使用 webhook 方式）
 */
import axios from "axios";
import { config } from "./config";

/**
 * 发送文本消息到飞书群聊
 */
export async function sendMessage(content: string): Promise<boolean> {
  try {
    const response = await axios.post(config.feishu.webhookUrl, {
      msg_type: "text",
      content: {
        text: content,
      },
    });

    // 飞书 webhook 成功时返回 200，响应体可能为空或包含 {code: 0}
    if (response.status === 200) {
      if (
        response.data &&
        response.data.code !== undefined &&
        response.data.code !== 0
      ) {
        console.error("❌ 消息发送失败:", response.data.msg || response.data);
        return false;
      }
      console.log("✅ 消息发送成功");
      return true;
    } else {
      console.error("❌ 消息发送失败:", response.status, response.data);
      return false;
    }
  } catch (error: any) {
    console.error("❌ 发送消息时出错:", error.message);
    return false;
  }
}

/**
 * 发送富文本卡片消息
 */
export async function sendCardMessage(
  title: string,
  content: string,
  weatherInfo?: any
): Promise<boolean> {
  try {
    // 构建卡片内容
    const cardContent = {
      config: {
        wide_screen_mode: true,
      },
      header: {
        title: {
          tag: "plain_text",
          content: title,
        },
        template: "blue",
      },
      elements: [
        {
          tag: "div",
          text: {
            tag: "lark_md",
            content: content,
          },
        },
      ],
    };

    // 如果有天气信息，添加到卡片中
    if (weatherInfo) {
      cardContent.elements.push({
        tag: "div",
        text: {
          tag: "lark_md",
          content: `**🌡️ 温度**: ${weatherInfo.temp}°C  |  **☁️ 天气**: ${weatherInfo.description}`,
        },
      });
    }

    const response = await axios.post(config.feishu.webhookUrl, {
      msg_type: "interactive",
      card: cardContent,
    });

    // 飞书 webhook 成功时返回 200，响应体可能为空或包含 {code: 0}
    if (response.status === 200) {
      if (
        response.data &&
        response.data.code !== undefined &&
        response.data.code !== 0
      ) {
        console.error(
          "❌ 卡片消息发送失败:",
          response.data.msg || response.data
        );
        return false;
      }
      console.log("✅ 卡片消息发送成功");
      return true;
    } else {
      console.error("❌ 卡片消息发送失败:", response.status, response.data);
      return false;
    }
  } catch (error: any) {
    console.error("❌ 发送卡片消息时出错:", error.message);
    return false;
  }
}
