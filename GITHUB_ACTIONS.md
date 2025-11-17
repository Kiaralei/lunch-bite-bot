# GitHub Actions 部署指南

## 📋 前置要求

- GitHub 账号
- 已创建 GitHub 仓库并推送代码

## 🚀 快速开始

### 1. 配置 GitHub Secrets

GitHub Secrets 用于安全存储敏感信息（如 API Key），不会暴露在代码中。

#### 步骤：

1. 进入你的 GitHub 仓库
2. 点击 `Settings`（设置）
3. 在左侧菜单找到 `Secrets and variables` → `Actions`
4. 点击 `New repository secret`（新建仓库密钥）

#### 需要添加的 Secrets：

**必需配置：**

- `FEISHU_WEBHOOK_URL`: 飞书 Webhook URL
  - 格式：`https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxxxxxxx`

**可选配置：**

- `WEATHER_API_KEY`: OpenWeatherMap API Key
- `WEATHER_CITY`: 城市名称（如：Beijing）
- `WEATHER_LAT`: 纬度（如：39.9042）
- `WEATHER_LON`: 经度（如：116.4074）
- `OPENAI_API_KEY`: OpenAI API Key
- `OPENAI_MODEL`: OpenAI 模型（默认：gpt-3.5-turbo）
- `REMINDER_HOUR`: 提醒小时（0-23，默认：12）
- `REMINDER_MINUTE`: 提醒分钟（0-59，默认：0）

### 2. 配置定时任务

编辑 `.github/workflows/lunch-reminder.yml` 文件，修改 `schedule` 部分：

```yaml
schedule:
  - cron: "0 4 * * *" # UTC 4:00 = 北京时间 12:00
```

#### Cron 表达式说明

GitHub Actions 使用 UTC 时间，需要根据你的时区调整：

| 北京时间 | UTC 时间 | Cron 表达式  |
| -------- | -------- | ------------ |
| 12:00    | 04:00    | `0 4 * * *`  |
| 11:30    | 03:30    | `30 3 * * *` |
| 13:00    | 05:00    | `0 5 * * *`  |

**Cron 格式**：`分钟 小时 日 月 星期`

- `0 4 * * *` - 每天 UTC 4:00（北京时间 12:00）
- `30 3 * * *` - 每天 UTC 3:30（北京时间 11:30）
- `0 4,16 * * *` - 每天 UTC 4:00 和 16:00（北京时间 12:00 和 00:00）

### 3. 测试运行

#### 方法 1: 手动触发

1. 进入 GitHub 仓库的 `Actions` 标签
2. 选择 `午餐提醒机器人` workflow
3. 点击 `Run workflow` 按钮
4. 选择分支（通常是 `main` 或 `master`）
5. 点击绿色的 `Run workflow` 按钮

#### 方法 2: 推送代码触发

如果 workflow 中配置了 `push` 事件，推送代码会自动触发。

### 4. 查看运行结果

1. 在 `Actions` 页面，点击最新的运行记录
2. 展开 `运行提醒任务` 步骤
3. 查看日志输出，确认是否成功

**成功标志**：

- ✅ 看到 "消息发送成功"
- ✅ 飞书群聊收到提醒消息

**失败排查**：

- 检查 Secrets 是否配置正确
- 查看错误日志
- 确认 Webhook URL 是否有效

## 🔧 高级配置

### 多时区支持

如果需要支持多个时区，可以创建多个 schedule：

```yaml
schedule:
  - cron: "0 4 * * *" # 北京时间 12:00
  - cron: "0 5 * * *" # 北京时间 13:00
```

### 使用环境变量

如果某些配置不需要保密，可以直接在 workflow 文件中设置：

```yaml
env:
  WEATHER_CITY: Beijing
  WEATHER_LAT: 39.9042
  WEATHER_LON: 116.4074
```

### 修改 Node.js 版本

在 workflow 文件中修改：

```yaml
- name: 设置 Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "20" # 改为你需要的版本
```

### 使用 pnpm

如果项目使用 pnpm，修改 workflow：

```yaml
- name: 设置 Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "18"
    cache: "pnpm" # 改为 pnpm

- name: 安装 pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 8

- name: 安装依赖
  run: pnpm install
```

## 📊 查看运行历史

在 `Actions` 页面可以查看：

- 所有运行记录
- 每次运行的状态（成功/失败）
- 运行时间和日志
- 触发方式（定时/手动/推送）

## ⚠️ 注意事项

1. **免费额度**：

   - 公开仓库：无限免费
   - 私有仓库：每月 2000 分钟免费

2. **时区问题**：

   - GitHub Actions 使用 UTC 时间
   - 记得根据你的时区调整 cron 表达式

3. **Secrets 安全**：

   - Secrets 不会在日志中显示
   - 不要将敏感信息直接写在代码中
   - 如果 Secrets 泄露，立即在 GitHub 中删除并重新创建

4. **运行时间**：

   - 定时任务可能延迟几分钟执行
   - 不是精确到秒的定时

5. **失败重试**：
   - GitHub Actions 不会自动重试
   - 如果失败，需要手动重新运行或等待下次定时

## 🐛 常见问题

### Q: 定时任务没有运行？

A: 检查：

1. workflow 文件是否在 `.github/workflows/` 目录
2. cron 表达式是否正确
3. 仓库是否激活了 Actions（Settings → Actions → General）

### Q: 运行失败，提示找不到模块？

A: 确保：

1. `package.json` 已提交到仓库
2. workflow 中正确安装了依赖
3. Node.js 版本兼容

### Q: 消息发送失败？

A: 检查：

1. `FEISHU_WEBHOOK_URL` Secret 是否正确
2. Webhook URL 是否仍然有效
3. 网络连接是否正常

### Q: 如何修改提醒时间？

A: 修改 workflow 文件中的 cron 表达式，或设置 `REMINDER_HOUR` 和 `REMINDER_MINUTE` Secrets。

## 📚 参考资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Cron 表达式生成器](https://crontab.guru/)
- [时区转换工具](https://www.timeanddate.com/worldclock/converter.html)
