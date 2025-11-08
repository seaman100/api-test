# OpenWeatherMap API 故障排除指南

## 🔍 问题诊断

### API Key 无效 (401错误)

如果你遇到"API Key无效"错误，请按以下步骤排查：

#### 1. 检查API Key来源
✅ **正确的获取方式**：
- 访问 https://openweathermap.org/api
- 注册免费账号
- 在Dashboard的"API keys"标签页中创建新的API Key
- 复制完整的API Key（通常是32位字符）

❌ **常见错误**：
- 使用示例API Key
- 从非官方来源获取API Key
- API Key包含空格或特殊字符
- 复制时遗漏了部分字符

#### 2. 验证API Key格式
有效的API Key应该是：
- 32位十六进制字符
- 只包含字母和数字
- 示例：`170202434e7c4230f7e04ab6f1c3c7ab`

#### 3. 激活时间
新创建的API Key可能需要等待**5-10分钟**才能完全激活。

#### 4. 账户状态
确保你的OpenWeatherMap账户：
- 已验证邮箱
- 账户状态正常
- 没有超出免费配额

### 🛠️ 测试方法

#### 方法一：使用curl命令
```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=Beijing,CN&appid=YOUR_API_KEY&units=metric&lang=zh_cn"
```

**成功响应示例**：
```json
{
  "coord": {"lon":116.4074,"lat":39.9042},
  "weather":[{"id":800,"main":"Clear","description":"晴朗","icon":"01d"}],
  "base":"stations",
  "main":{"temp":15.5,"feels_like":14.8,"temp_min":12,"temp_max":18,"pressure":1013,"humidity":64},
  "visibility":10000,
  "wind":{"speed":3.6,"deg":300},
  "clouds":{"all":0},
  "dt":1699486800,
  "sys":{"type":1,"id":9609,"country":"CN","sunrise":1699460200,"sunset":1699501600},
  "timezone":28800,
  "id":1816670,
  "name":"Beijing",
  "cod":200
}
```

#### 方法二：使用浏览器开发者工具
1. 打开 http://localhost:3001/openweather
2. 按F12打开开发者工具
3. 查看Console标签页的日志输出
4. 尝试获取天气数据，观察错误信息

### 🔧 常见解决方案

#### 问题1：API Key一直显示无效
**解决方案**：
1. 重新生成新的API Key
2. 等待5-10分钟让Key激活
3. 检查账户是否超出配额限制
4. 确认API Key复制完整，没有遗漏字符

#### 问题2：页面没有反应
**解决方案**：
1. 检查浏览器控制台是否有JavaScript错误
2. 确认网络连接正常
3. 尝试刷新页面
4. 清除浏览器缓存

#### 问题3：网络连接问题
**解决方案**：
1. 检查防火墙设置
2. 尝试使用VPN
3. 检查DNS设置
4. 使用手机热点测试

### 📞 联系支持

如果以上方法都无法解决，请联系OpenWeatherMap支持：
- 官方FAQ：https://openweathermap.org/faq
- 支持邮箱：support@openweathermap.org
- 错误代码说明：https://openweathermap.org/faq#error401

### 🧪 测试工具

项目包含了测试工具 `test-api.js`，可以用来验证API Key：

```bash
node test-api.js
```

这将显示详细的API调用过程和错误信息。

### 📋 检查清单

在报告问题前，请确认：

- [ ] API Key是从OpenWeatherMap官方Dashboard获取的
- [ ] API Key是32位十六进制字符
- [ ] 已经等待了至少10分钟让Key激活
- [ ] 账户邮箱已验证
- [ ] 没有超出免费配额限制
- [ ] 网络连接正常
- [ ] 浏览器控制台没有其他JavaScript错误

### 🔐 安全提醒

- **永远不要**在公共代码仓库中提交API Key
- **定期更换**API Key以确保安全
- **使用环境变量**而不是硬编码在代码中
- **限制API Key**的使用权限

如果所有方法都失败了，你可以：
1. 使用Open-Meteo API（无需API Key）
2. 注册新的OpenWeatherMap账户
3. 联系你的网络管理员检查防火墙设置
