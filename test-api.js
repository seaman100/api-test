// 测试OpenWeatherMap API Key
const API_KEY = '170202434e7c4230f7e04ab6f1c3c7ab'; // 你的新API Key
const CITY = 'Beijing,CN';

async function testApiKey() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=zh_cn`;
    
    console.log('测试URL:', url);
    
    try {
        const response = await fetch(url);
        console.log('响应状态:', response.status);
        console.log('响应头:', response.headers);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('错误响应:', errorText);
            
            if (response.status === 401) {
                console.error('❌ API Key无效或未激活');
                console.error('请检查:');
                console.error('1. API Key是否正确');
                console.error('2. API Key是否已激活（可能需要等待几分钟）');
                console.error('3. 账户是否有足够的配额');
            } else if (response.status === 404) {
                console.error('❌ 城市未找到');
            } else {
                console.error(`❌ 其他错误: ${response.status}`);
            }
        } else {
            const data = await response.json();
            console.log('✅ API Key有效！');
            console.log('天气数据:', data);
        }
    } catch (error) {
        console.error('❌ 网络错误:', error);
    }
}

testApiKey();
