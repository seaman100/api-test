'use client';

import { useState, useEffect } from 'react';

interface OpenWeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

const cities = [
  { name: 'Beijing', country: 'CN', chineseName: '北京' },
  { name: 'Shanghai', country: 'CN', chineseName: '上海' },
  { name: 'Guangzhou', country: 'CN', chineseName: '广州' },
  { name: 'Shenzhen', country: 'CN', chineseName: '深圳' },
  { name: 'Chengdu', country: 'CN', chineseName: '成都' },
  { name: 'Hangzhou', country: 'CN', chineseName: '杭州' },
  { name: 'Wuhan', country: 'CN', chineseName: '武汉' },
  { name: 'Xian', country: 'CN', chineseName: '西安' },
  { name: 'Chongqing', country: 'CN', chineseName: '重庆' },
  { name: 'Nanjing', country: 'CN', chineseName: '南京' },
  { name: 'Tokyo', country: 'JP', chineseName: '东京' },
  { name: 'New York', country: 'US', chineseName: '纽约' },
  { name: 'London', country: 'GB', chineseName: '伦敦' },
  { name: 'Paris', country: 'FR', chineseName: '巴黎' },
  { name: 'Sydney', country: 'AU', chineseName: '悉尼' },
  { name: 'Moscow', country: 'RU', chineseName: '莫斯科' },
  { name: 'Dubai', country: 'AE', chineseName: '迪拜' },
  { name: 'Singapore', country: 'SG', chineseName: '新加坡' },
  { name: 'Hong Kong', country: 'HK', chineseName: '香港' },
  { name: 'Taipei', country: 'TW', chineseName: '台北' },
];

const getWeatherDescription = (description: string): string => {
  const descriptions: { [key: string]: string } = {
    'clear sky': '晴朗',
    'few clouds': '少云',
    'scattered clouds': '散云',
    'broken clouds': '多云',
    'overcast clouds': '阴天',
    'shower rain': '阵雨',
    'rain': '雨',
    'thunderstorm': '雷暴',
    'snow': '雪',
    'mist': '薄雾',
    'fog': '雾',
    'haze': '霾',
    'dust': '沙尘',
    'sand': '沙暴',
    'ash': '火山灰',
    'squall': '飑',
    'tornado': '龙卷风',
  };
  return descriptions[description.toLowerCase()] || description;
};

const getWindDirection = (degrees: number): string => {
  const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function OpenWeatherPage() {
  const [weatherData, setWeatherData] = useState<OpenWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [currentCity, setCurrentCity] = useState(cities[0]);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  // 检查环境变量中是否有API Key
  const envApiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const effectiveApiKey = apiKey || envApiKey || '';

  const fetchWeatherData = async (city: typeof cities[0], key: string) => {
    console.log('开始获取天气数据:', { city: city.name, key: key.substring(0, 10) + '...' });
    
    if (!key.trim()) {
      setError('请输入OpenWeatherMap API Key');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.name},${city.country}&appid=${key}&units=metric&lang=zh_cn`;
      console.log('请求URL:', url);
      
      // 尝试绕过代理的fetch选项
      const fetchOptions: RequestInit = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        // 尝试禁用代理
        mode: 'cors'
      };
      
      const response = await fetch(url, fetchOptions);
      console.log('响应状态:', response.status);
      console.log('响应头:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('错误响应内容:', errorText);
        
        if (response.status === 401) {
          throw new Error('API Key无效。请检查：1) API Key是否正确 2) 是否已激活（新Key需等待5-10分钟） 3) 账户是否超出配额');
        } else if (response.status === 404) {
          throw new Error('城市未找到');
        } else if (response.status === 429) {
          throw new Error('API调用频率超限，请稍后重试');
        } else {
          throw new Error(`获取天气数据失败: ${response.status} - ${errorText}`);
        }
      }
      
      const data = await response.json();
      console.log('获取到的数据:', data);
      setWeatherData(data);
      setShowApiKeyInput(false);
    } catch (err) {
      console.error('API调用完整错误:', err);
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  const getRandomCity = () => {
    const randomIndex = Math.floor(Math.random() * cities.length);
    const randomCity = cities[randomIndex];
    setCurrentCity(randomCity);
    if (effectiveApiKey) {
      fetchWeatherData(randomCity, effectiveApiKey);
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      fetchWeatherData(currentCity, apiKey);
    }
  };

  const handleCitySelect = (city: typeof cities[0]) => {
    setCurrentCity(city);
    if (effectiveApiKey) {
      fetchWeatherData(city, effectiveApiKey);
    }
  };

  // 页面加载时检查是否有环境变量API Key
  useEffect(() => {
    console.log('页面加载，环境变量API Key:', envApiKey ? envApiKey.substring(0, 10) + '...' : '未设置');
    
    if (envApiKey && envApiKey !== 'your_api_key_here') {
      console.log('使用环境变量API Key获取天气数据');
      fetchWeatherData(currentCity, envApiKey);
    } else {
      console.log('显示API Key输入界面');
      setShowApiKeyInput(true);
    }
  }, []);

  if (showApiKeyInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-600 p-4">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
            <h1 className="text-3xl font-bold text-white mb-6 text-center">
              OpenWeatherMap 天气
            </h1>
            <form onSubmit={handleApiKeySubmit} className="space-y-4">
              <div>
                <label className="block text-white mb-2">API Key</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="请输入您的OpenWeatherMap API Key"
                  className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-white/60"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">选择城市</label>
                <select
                  value={currentCity.name}
                  onChange={(e) => {
                    const city = cities.find(c => c.name === e.target.value);
                    if (city) handleCitySelect(city);
                  }}
                  aria-label="选择城市"
                  className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/60"
                >
                  {cities.map((city) => (
                    <option key={city.name} value={city.name} className="text-gray-800">
                      {city.chineseName} ({city.name})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all transform hover:scale-105 font-semibold"
              >
                获取天气数据
              </button>
            </form>
            <div className="mt-6 text-white/60 text-sm text-center">
              <p>需要API Key？请访问</p>
              <a 
                href="https://openweathermap.org/api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white underline"
              >
                openweathermap.org/api
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
        <div className="text-white text-2xl">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
        <div className="text-white text-center max-w-md mx-auto p-8">
          <div className="text-2xl mb-4">错误</div>
          <div className="text-lg mb-6">{error}</div>
          <div className="space-y-3">
            <button 
              onClick={() => setShowApiKeyInput(true)}
              className="w-full px-6 py-3 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              重新输入API Key
            </button>
            <button 
              onClick={getRandomCity}
              className="w-full px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="mb-4">
            <a 
              href="/" 
              className="inline-block px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all mr-4"
            >
              Open-Meteo 天气
            </a>
            <span className="text-white/60">当前页面: OpenWeatherMap</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">OpenWeatherMap 天气</h1>
          <p className="text-white/80">使用OpenWeatherMap API展示天气信息</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white">
                {cities.find(c => c.name === weatherData.name)?.chineseName || weatherData.name}, {weatherData.sys.country}
              </h2>
              <p className="text-white/80 text-sm">
                {weatherData.coord.lat.toFixed(2)}°N, {weatherData.coord.lon.toFixed(2)}°E
              </p>
            </div>
            <div className="flex gap-3">
              <select
                value={weatherData.name}
                onChange={(e) => {
                  const city = cities.find(c => c.name === e.target.value);
                  if (city) handleCitySelect(city);
                }}
                aria-label="选择城市"
                className="px-4 py-2 bg-white/20 text-white rounded-xl border border-white/30 focus:outline-none focus:border-white/60"
              >
                {cities.map((city) => (
                  <option key={city.name} value={city.name} className="text-gray-800">
                    {city.chineseName}
                  </option>
                ))}
              </select>
              <button
                onClick={getRandomCity}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all transform hover:scale-105"
              >
                🎲 随机城市
              </button>
              <button
                onClick={() => setShowApiKeyInput(true)}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
              >
                🔑 更换API Key
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">
                  <img 
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                    alt={weatherData.weather[0].description}
                    className="w-24 h-24 mx-auto"
                  />
                </div>
                <div className="text-3xl font-bold text-white">
                  {weatherData.main.temp.toFixed(1)}°C
                </div>
                <div className="text-white/80">
                  体感温度: {weatherData.main.feels_like.toFixed(1)}°C
                </div>
                <div className="text-white/80 mt-2">
                  {getWeatherDescription(weatherData.weather[0].description)}
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">详细信息</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-white">
                  <span>湿度</span>
                  <span>{weatherData.main.humidity}%</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>气压</span>
                  <span>{weatherData.main.pressure} hPa</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>风速</span>
                  <span>{weatherData.wind.speed.toFixed(1)} m/s</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>风向</span>
                  <span>{getWindDirection(weatherData.wind.deg)}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>云量</span>
                  <span>{weatherData.clouds.all}%</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>能见度</span>
                  <span>{(weatherData.visibility / 1000).toFixed(1)} km</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">温度范围</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-white">
                  <span>最高</span>
                  <span className="font-semibold">{weatherData.main.temp_max.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>最低</span>
                  <span className="font-semibold">{weatherData.main.temp_min.toFixed(1)}°C</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">日出日落</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-white">
                  <span>日出</span>
                  <span className="font-semibold">{formatTime(weatherData.sys.sunrise)}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>日落</span>
                  <span className="font-semibold">{formatTime(weatherData.sys.sunset)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">数据信息</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-white">
                  <span>城市ID</span>
                  <span className="font-semibold">{weatherData.id}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>时区</span>
                  <span className="font-semibold">{weatherData.timezone / 3600}h</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-white/60 text-sm">
          <p>数据来源: OpenWeatherMap API</p>
          <p>选择城市或点击&ldquo;随机城市&rdquo;按钮查看其他城市的天气</p>
        </div>
      </div>
    </div>
  );
}
