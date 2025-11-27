# 🍽️ Lunch Bite Bot - 午餐提醒机器人

一个智能的飞书机器人，每天中午提醒你点外卖，并根据天气情况提供 AI 智能推荐。

## ✨ 功能特性

- ⏰ **定时提醒**: 每天自动提醒点外卖（默认 11:15）
- 🌤️ **天气感知**: 根据实时天气情况推荐适合的外卖
- 🤖 **AI 智能分析**: 使用 AI API 分析天气并生成个性化推荐
- 💬 **飞书集成**: 通过飞书群聊接收提醒和推荐（使用 Webhook 方式）

## 📋 前置要求

- Node.js >= 16.0.0
- pnpm（推荐）或 npm
- 飞书群聊（用于接收提醒消息）
- OpenWeatherMap API Key（可选，用于获取天气）
- AI API Key（可选，用于 AI 分析）

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 文件为 `.env`，并填写相关配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填写以下配置：

```env
# 飞书机器人配置（必需）- 使用 Webhook 方式
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxxxxxxx

# 天气API配置（可选，不配置会使用模拟数据）
WEATHER_API_KEY=your_weather_api_key
WEATHER_CITY=Shanghai
WEATHER_LAT=31.163273
WEATHER_LON=121.389084

# AI分析配置（可选，不配置会使用基础推荐）
NEWAPI_TOKEN=your_ai_api_key
NEWAPI_MODEL=gpt-3.5-turbo

# 提醒时间配置（可选，默认11:15）
REMINDER_HOUR=11
REMINDER_MINUTE=15
```

### 3. 获取飞书 Webhook URL

1. 在飞书群聊中，点击右上角的 `...` 菜单
2. 选择 `设置` -> `群机器人` -> `添加机器人` -> `自定义机器人`
3. 填写机器人名称和描述（如：午餐提醒机器人）
4. 创建后，复制生成的 `Webhook 地址`
5. 将 Webhook 地址填入 `.env` 文件的 `FEISHU_WEBHOOK_URL`

**注意**: Webhook URL 格式类似：`https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxxxxxxx`

### 4. 获取天气 API Key（可选）

1. 访问 [OpenWeatherMap](https://openweathermap.org/api)
2. 注册账号并创建 API Key
3. 将 API Key 填入 `.env` 文件

### 5. 获取 AI API Key（可选）

根据你使用的 AI 服务提供商获取 API Key，并填入 `.env` 文件的 `NEWAPI_TOKEN`。

**注意**: 如果 AI API 是内网服务，GitHub Actions 可能无法访问，建议部署到可访问内网的服务器。

### 6. 编译和运行

```bash
# 安装依赖（使用 pnpm）
pnpm install

# 编译TypeScript
pnpm run build

# 运行程序
pnpm start

# 或者开发模式（使用ts-node）
pnpm run dev
```

## 📁 项目结构

```
lunch-bite-bot/
├── src/
│   ├── config.ts      # 配置文件
│   ├── feishu.ts      # 飞书机器人消息发送
│   ├── weather.ts     # 天气API服务
│   ├── ai.ts          # AI分析推荐服务
│   └── index.ts       # 主程序入口
├── dist/              # 编译后的JavaScript文件
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 配置说明

### 必需配置

- `FEISHU_WEBHOOK_URL`: 飞书机器人的 Webhook URL（在群聊中创建自定义机器人后获取）

### 可选配置

- `WEATHER_API_KEY`: OpenWeatherMap API Key（不配置会使用模拟天气数据）
- `WEATHER_CITY`: 城市名称（默认：Beijing）
- `WEATHER_LAT`: 纬度（默认：39.9042，北京）
- `WEATHER_LON`: 经度（默认：116.4074，北京）
- `NEWAPI_TOKEN`: NEWAPI_TOKEN（不配置会使用基础推荐）
- `NEWAPI_MODEL`: OpenAI 模型（默认：gpt-3.5-turbo）
- `REMINDER_HOUR`: 提醒小时（24 小时制，默认：12）
- `REMINDER_MINUTE`: 提醒分钟（默认：0）

## 🎯 使用场景

1. **个人使用**: 在个人电脑上运行，每天中午自动提醒
2. **服务器部署**: 部署到云服务器，24 小时运行
3. **团队使用**: 配置到团队群聊，大家一起接收提醒

## 🚢 部署建议

### 使用 GitHub Actions 部署（推荐，免费）

GitHub Actions 可以免费运行定时任务，非常适合这个项目。

#### 步骤 1: 配置 GitHub Secrets

1. 进入你的 GitHub 仓库
2. 点击 `Settings` → `Secrets and variables` → `Actions`
3. 点击 `New repository secret`，添加以下 secrets：

   - `FEISHU_WEBHOOK_URL`: 飞书 Webhook URL（必需）
   - `WEATHER_API_KEY`: 天气 API Key（可选）
   - `WEATHER_CITY`: 城市名称（可选，默认：Beijing）
   - `WEATHER_LAT`: 纬度（可选，默认：39.9042）
   - `WEATHER_LON`: 经度（可选，默认：116.4074）
   - `OPENAI_API_KEY`: OpenAI API Key（可选）
   - `OPENAI_MODEL`: OpenAI 模型（可选，默认：gpt-3.5-turbo）
   - `REMINDER_HOUR`: 提醒小时（可选，默认：12）
   - `REMINDER_MINUTE`: 提醒分钟（可选，默认：0）

#### 步骤 2: 调整定时时间

编辑 `.github/workflows/lunch-reminder.yml` 文件中的 `cron` 表达式：

```yaml
schedule:
  - cron: "0 4 * * *" # UTC 4:00 = 北京时间 12:00
```

**时区说明**：

- GitHub Actions 使用 UTC 时间
- 北京时间 = UTC + 8
- 例如：北京时间 12:00 = UTC 04:00

#### 步骤 3: 测试运行

1. 在 GitHub 仓库页面，点击 `Actions` 标签
2. 选择 `午餐提醒机器人` workflow
3. 点击 `Run workflow` 手动触发一次测试

#### 步骤 4: 查看运行日志

在 `Actions` 页面可以查看每次运行的日志，确认是否成功发送消息。

**优点**：

- ✅ 完全免费（私有仓库每月 2000 分钟，公开仓库无限）
- ✅ 无需维护服务器
- ✅ 自动运行，无需担心服务器重启
- ✅ 可以查看运行历史

### 使用 PM2 部署（需要服务器）

```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start dist/index.js --name lunch-bot

# 设置开机自启
pm2 startup
pm2 save
```

### 使用 Docker 部署

创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

构建和运行：

```bash
docker build -t lunch-bite-bot .
docker run -d --env-file .env --name lunch-bot lunch-bite-bot
```

## 📝 开发

```bash
# 开发模式（自动重新编译）
npm run watch

# 在另一个终端运行
npm run dev
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [飞书开放平台](https://open.feishu.cn/)
- [OpenWeatherMap](https://openweathermap.org/)
- [OpenAI](https://openai.com/)
