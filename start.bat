@echo off
echo 🚀 启动午餐提醒机器人...
echo.

if not exist node_modules (
    echo 📦 正在安装依赖...
    call npm install
    echo.
)

if not exist dist (
    echo 🔨 正在编译TypeScript...
    call npm run build
    echo.
)

echo ✅ 启动机器人...
echo.
call npm start

