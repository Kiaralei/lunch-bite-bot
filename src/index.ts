/**
 * 午餐提醒机器人主程序
 */
import * as cron from "node-cron";
import { config } from "./config";
import { sendCardMessage } from "./feishu";
import { getWeather, getWeatherRecommendation } from "./weather";
import { getAIRecommendation } from "./ai";

/**
 * 执行提醒任务
 */
async function sendLunchReminder(): Promise<void> {
  console.log("🍽️ 开始执行午餐提醒任务...");

  try {
    // 获取天气信息
    console.log("📡 正在获取天气信息...");
    const weather = await getWeather();

    if (!weather) {
      console.error("❌ 无法获取天气信息");
      await sendCardMessage(
        "🍽️ 午餐时间到！",
        "该点外卖啦！今天想吃什么？\n\n（天气信息获取失败，请手动选择）"
      );
      return;
    }

    console.log(
      `✅ 天气信息获取成功: ${weather.city} ${weather.temp}°C ${weather.description}`
    );

    // 获取AI推荐
    console.log("🤖 正在生成AI推荐...");
    const aiRecommendation = await getAIRecommendation(weather);

    // 构建消息内容
    const messageContent = `🍽️ **午餐时间到！**\n\n${aiRecommendation}\n\n---\n\n💡 **天气小贴士**\n${getWeatherRecommendation(
      weather
    )}`;
    console.log("messageContent: ", messageContent);

    // 发送消息
    console.log("📤 正在发送消息到飞书...");
    await sendCardMessage("🍽️ 午餐提醒", messageContent, weather);

    console.log("✅ 提醒任务完成！");
  } catch (error: any) {
    console.error("❌ 执行提醒任务时出错:", error);

    // 发送错误提示
    await sendCardMessage(
      "🍽️ 午餐时间到！",
      "该点外卖啦！今天想吃什么？\n\n（系统遇到了一些问题，但还是要记得吃饭哦~）"
    );
  }
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  console.log("🚀 午餐提醒机器人启动中...");
  console.log(
    `📅 提醒时间: 每天 ${config.reminder.hour}:${String(
      config.reminder.minute
    ).padStart(2, "0")}`
  );

  // 验证配置
  if (!config.feishu.webhookUrl) {
    console.error("❌ 错误: 请配置飞书 Webhook URL（FEISHU_WEBHOOK_URL）");
    process.exit(1);
  }

  // 设置定时任务（每天指定时间执行）
  const cronExpression = `${config.reminder.minute} ${config.reminder.hour} * * *`;

  console.log(`⏰ 定时任务已设置: ${cronExpression}`);

  cron.schedule(cronExpression, async () => {
    await sendLunchReminder();
  });

  // 启动时立即执行一次
  // console.log("🔔 立即执行一次提醒（用于测试）...");
  // await sendLunchReminder();

  console.log("✅ 机器人已启动，等待定时任务触发...");
  console.log("💡 提示: 按 Ctrl+C 退出程序");
}

// 运行主函数
main().catch((error) => {
  console.error("❌ 程序启动失败:", error);
  process.exit(1);
});
