# 设置指南

## 快速配置步骤

### 1. 飞书机器人配置（使用 Webhook 方式）

#### 步骤 1: 在群聊中创建自定义机器人

1. 打开飞书，进入你想要接收提醒的群聊
2. 点击群聊右上角的 `...` 菜单
3. 选择 `设置` -> `群机器人` -> `添加机器人` -> `自定义机器人`
4. 填写机器人信息：
   - **机器人名称**: 午餐提醒机器人（或你喜欢的名称）
   - **机器人描述**: 每天中午提醒点外卖（可选）
5. 点击 `添加` 创建机器人

#### 步骤 2: 获取 Webhook URL

1. 创建机器人后，会显示一个 **Webhook 地址**
2. 格式类似：`https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxxxxxxx`
3. **重要**: 请立即复制并保存这个 URL，它只会显示一次！
4. 如果忘记保存，需要删除机器人后重新创建

**提示**: Webhook URL 是发送消息的唯一凭证，请妥善保管，不要泄露给他人。

### 2. 天气 API 配置（可选）

#### 使用 OpenWeatherMap

1. 访问 https://openweathermap.org/api
2. 注册账号（免费）
3. 在 Dashboard 中创建 API Key
4. 将 API Key 填入 `.env` 文件

**注意**: 如果不配置天气 API，程序会使用模拟天气数据，功能仍然可用。

### 3. OpenAI API 配置（可选）

1. 访问 https://platform.openai.com/
2. 注册账号并充值（需要付费）
3. 在 API Keys 页面创建新的密钥
4. 将 API Key 填入 `.env` 文件

**注意**: 如果不配置 OpenAI API，程序会使用基础推荐算法，功能仍然可用。

### 4. 环境变量配置

创建 `.env` 文件（从 `.env.example` 复制）：

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

编辑 `.env` 文件，至少填写飞书 Webhook URL：

```env
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxxxxxxx
```

### 5. 安装和运行

```bash
# 安装依赖
npm install

# 编译TypeScript
npm run build

# 运行程序
npm start
```

### 6. 测试

程序启动后，你可以：

1. **立即测试**: 修改 `src/index.ts`，取消注释测试代码：

   ```typescript
   // 启动时立即执行一次（可选，用于测试）
   await sendLunchReminder();
   ```

2. **手动触发**: 或者修改定时任务时间，设置为当前时间的几分钟后

3. **查看日志**: 程序会输出详细的运行日志，包括：
   - 天气获取状态
   - AI 分析状态
   - 消息发送状态

## 常见问题

### Q: 如何知道机器人是否正常工作？

A: 查看控制台日志，应该看到：

- ✅ 天气信息获取成功
- ✅ AI 推荐生成成功
- ✅ 消息发送成功

### Q: 消息发送失败怎么办？

A: 检查以下几点：

1. `FEISHU_WEBHOOK_URL` 是否正确（完整复制，不要遗漏任何字符）
2. Webhook URL 是否已过期（如果机器人被删除，URL 会失效）
3. 机器人是否仍在群聊中（如果被移除，需要重新创建）
4. 网络连接是否正常

### Q: 天气 API 获取失败？

A:

1. 检查 `WEATHER_API_KEY` 是否正确
2. 检查网络连接
3. 如果不配置天气 API，程序会使用模拟数据，不影响基本功能

### Q: AI 推荐不工作？

A:

1. 检查 `OPENAI_API_KEY` 是否正确
2. 检查账户余额是否充足
3. 如果不配置 OpenAI API，程序会使用基础推荐算法

### Q: 如何修改提醒时间？

A: 修改 `.env` 文件中的 `REMINDER_HOUR` 和 `REMINDER_MINUTE`，例如：

```env
REMINDER_HOUR=11
REMINDER_MINUTE=30
```

表示每天 11:30 提醒。

### Q: 如何部署到服务器？

A: 推荐使用 PM2：

```bash
npm install -g pm2
npm run build
pm2 start dist/index.js --name lunch-bot
pm2 startup
pm2 save
```

## 下一步

- 自定义推荐逻辑
- 添加更多天气数据源
- 集成其他 AI 服务
- 添加用户偏好设置
