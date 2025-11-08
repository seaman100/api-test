# 天气网站

这是一个使用Next.js构建的天气网站，支持两种不同的天气API：

## 功能特性

### 🌤️ Open-Meteo API (免费)
- 无需API Key，直接使用
- 支持15个主要城市
- 显示当前天气和未来4天预报
- 使用emoji天气图标

### 🌤️ OpenWeatherMap API (需要API Key)
- 需要注册OpenWeatherMap账号获取API Key
- 支持20个国际城市
- 显示详细的天气信息
- 使用官方天气图标
- 支持日出日落时间

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置OpenWeatherMap API Key (可选)
如果你想要使用OpenWeatherMap功能，需要配置API Key：

#### 获取有效的API Key
1. 访问 [OpenWeatherMap官网](https://openweathermap.org/api)
2. 注册免费账号
3. 在Dashboard中获取API Key
4. **重要**：新注册的API Key可能需要等待几分钟才能激活

#### 方法一：环境变量配置 (推荐)
1. 复制 `.env.local` 文件
2. 将 `your_api_key_here` 替换为你的真实API Key
3. 重启开发服务器

#### 方法二：页面输入
- 访问 http://localhost:3001/openweather
- 在页面中直接输入API Key

#### 验证API Key
可以使用以下命令测试API Key是否有效：
```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=Beijing,CN&appid=YOUR_API_KEY&units=metric&lang=zh_cn"
```

如果返回401错误，说明API Key无效或未激活。

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 访问网站
- Open-Meteo天气: http://localhost:3001/
- OpenWeatherMap天气: http://localhost:3001/openweather

## 获取OpenWeatherMap API Key

1. 访问 [OpenWeatherMap官网](https://openweathermap.org/api)
2. 注册免费账号
3. 在Dashboard中获取API Key
4. 将API Key配置到项目中

## 项目结构

```
├── app/
│   ├── page.tsx              # Open-Meteo天气页面
│   ├── openweather/
│   │   └── page.tsx         # OpenWeatherMap天气页面
│   ├── layout.tsx            # 根布局
│   └── globals.css           # 全局样式
├── .env.local                # 环境变量配置
└── README.md               # 项目说明
```

## 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **API**: Open-Meteo API, OpenWeatherMap API
- **部署**: Vercel (推荐)

## 特性对比

| 功能 | Open-Meteo | OpenWeatherMap |
|------|-------------|----------------|
| API Key | 不需要 | 需要 |
| 城市数量 | 15个 | 20个 |
| 天气预报 | ✅ 4天 | ❌ 仅当前 |
| 天气图标 | Emoji | 官方图标 |
| 日出日落 | ❌ | ✅ |
| 能见度 | ❌ | ✅ |
| 气压 | ❌ | ✅ |

## 部署

### Vercel部署 (推荐)
1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 在环境变量中配置API Key (可选)

### 其他平台
确保平台支持环境变量配置，以便正确设置OpenWeatherMap API Key。

## 开发

### 添加新城市
在对应页面的 `cities` 数组中添加城市信息：

```typescript
{ name: 'CityName', country: 'CountryCode', chineseName: '城市中文名' }
```

### 自定义样式
项目使用Tailwind CSS，可以在 `tailwind.config.ts` 中自定义主题。

## 许可证

MIT License
