'use client';

import { useState, useEffect } from 'react';

interface WeatherData {
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
}

const cities = [
  { name: '北京', country: '中国', latitude: 39.9042, longitude: 116.4074 },
  { name: '上海', country: '中国', latitude: 31.2304, longitude: 121.4737 },
  { name: '广州', country: '中国', latitude: 23.1291, longitude: 113.2644 },
  { name: '深圳', country: '中国', latitude: 22.5431, longitude: 114.0579 },
  { name: '成都', country: '中国', latitude: 30.5728, longitude: 104.0668 },
  { name: '杭州', country: '中国', latitude: 30.2741, longitude: 120.1551 },
  { name: '武汉', country: '中国', latitude: 30.5928, longitude: 114.3055 },
  { name: '西安', country: '中国', latitude: 34.3416, longitude: 108.9398 },
  { name: '重庆', country: '中国', latitude: 29.5630, longitude: 106.5516 },
  { name: '南京', country: '中国', latitude: 32.0603, longitude: 118.7969 },
  { name: '东京', country: '日本', latitude: 35.6762, longitude: 139.6503 },
  { name: '纽约', country: '美国', latitude: 40.7128, longitude: -74.0060 },
  { name: '伦敦', country: '英国', latitude: 51.5074, longitude: -0.1278 },
  { name: '巴黎', country: '法国', latitude: 48.8566, longitude: 2.3522 },
  { name: '悉尼', country: '澳大利亚', latitude: -33.8688, longitude: 151.2093 },
];

const getWeatherDescription = (code: number): string => {
  const weatherCodes: { [key: number]: string } = {
    0: '晴朗',
    1: '主要晴朗',
    2: '部分多云',
    3: '阴天',
    45: '雾',
    48: '雾凇',
    51: '小毛毛雨',
    53: '中毛毛雨',
    55: '浓毛毛雨',
    56: '冻毛毛雨',
    57: '浓冻毛毛雨',
    61: '小雨',
    63: '中雨',
    65: '大雨',
    66: '冻雨',
    67: '浓冻雨',
    71: '小雪',
    73: '中雪',
    75: '大雪',
    77: '雪粒',
    80: '小阵雨',
    81: '中阵雨',
    82: '大阵雨',
    85: '小阵雪',
    86: '大阵雪',
    95: '雷暴',
    96: '雷暴伴小冰雹',
    99: '雷暴伴大冰雹',
  };
  return weatherCodes[code] || '未知天气';
};

const getWeatherIcon = (code: number): string => {
  if (code === 0) return '☀️';
  if (code === 1 || code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 57) return '🌦️';
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 85 && code <= 86) return '🌨️';
  if (code >= 95) return '⛈️';
  return '🌤️';
};

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setCurrentCity] = useState(cities[0]);

  const fetchWeatherData = async (city: typeof cities[0]) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
      );
      
      if (!response.ok) {
        throw new Error('获取天气数据失败');
      }
      
      const data = await response.json();
      
      setWeatherData({
        location: {
          name: city.name,
          country: city.country,
          latitude: city.latitude,
          longitude: city.longitude,
        },
        current: data.current,
        daily: data.daily,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  const getRandomCity = () => {
    const randomIndex = Math.floor(Math.random() * cities.length);
    const randomCity = cities[randomIndex];
    setCurrentCity(randomCity);
    fetchWeatherData(randomCity);
  };

  useEffect(() => {
    getRandomCity();
  }, []);

  const getWindDirection = (degrees: number): string => {
    const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
        <div className="text-white text-2xl">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-2xl mb-4">错误</div>
          <div className="text-lg">{error}</div>
          <button 
            onClick={getRandomCity}
            className="mt-4 px-6 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="mb-4">
            <a 
              href="/openweather" 
              className="inline-block px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all mr-4"
            >
              OpenWeatherMap 天气
            </a>
            <span className="text-white/60">当前页面: Open-Meteo</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">天气预报</h1>
          <p className="text-white/80">随机展示世界各地的天气情况</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white">
                {weatherData.location.name}, {weatherData.location.country}
              </h2>
              <p className="text-white/80 text-sm">
                {weatherData.location.latitude.toFixed(2)}°N, {weatherData.location.longitude.toFixed(2)}°E
              </p>
            </div>
            <button
              onClick={getRandomCity}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all transform hover:scale-105"
            >
              🎲 随机城市
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">
                  {getWeatherIcon(weatherData.current.weather_code)}
                </div>
                <div className="text-2xl font-bold text-white">
                  {weatherData.current.temperature_2m.toFixed(1)}°C
                </div>
                <div className="text-white/80">
                  体感温度: {weatherData.current.apparent_temperature.toFixed(1)}°C
                </div>
                <div className="text-white/80 mt-2">
                  {getWeatherDescription(weatherData.current.weather_code)}
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">详细信息</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-white">
                  <span>湿度</span>
                  <span>{weatherData.current.relative_humidity_2m}%</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>风速</span>
                  <span>{weatherData.current.wind_speed_10m.toFixed(1)} km/h</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>风向</span>
                  <span>{getWindDirection(weatherData.current.wind_direction_10m)}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>降水</span>
                  <span>{weatherData.current.precipitation.toFixed(1)} mm</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>时间</span>
                  <span>{weatherData.current.is_day === 1 ? '白天' : '夜晚'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">未来几天</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {weatherData.daily.time.slice(0, 4).map((date, index) => (
                <div key={index} className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-white/80 text-sm mb-2">
                    {new Date(date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-2xl mb-2">
                    {getWeatherIcon(weatherData.daily.weather_code[index])}
                  </div>
                  <div className="text-white font-semibold">
                    {weatherData.daily.temperature_2m_max[index].toFixed(1)}°
                  </div>
                  <div className="text-white/70 text-sm">
                    {weatherData.daily.temperature_2m_min[index].toFixed(1)}°
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-white/60 text-sm">
          <p>数据来源: Open-Meteo API</p>
          <p>点击&ldquo;随机城市&rdquo;按钮查看其他城市的天气</p>
        </div>
      </div>
    </div>
  );
}
