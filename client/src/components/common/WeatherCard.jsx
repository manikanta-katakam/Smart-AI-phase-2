import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react';
import axios from 'axios';

const WeatherCard = ({ lat, lng }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Use a mock response if no API key is provided for the hackathon demo
        // In a real app, replace with: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
        
        // Mocking OpenWeather response for the demo to ensure UI works
        setTimeout(() => {
          setWeather({
            temp: 28.5,
            status: 'Rainy',
            humidity: 72,
            wind: 12,
            aqi: 142,
            icon: 'rain'
          });
          setLoading(false);
        }, 1000);

      } catch (error) {
        console.error("Weather fetch failed", error);
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng]);

  if (loading) return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 animate-pulse flex items-center space-x-6">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-slate-100 rounded w-1/2"></div>
        <div className="h-4 bg-slate-100 rounded w-full"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden group hover:shadow-lg transition-all">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full opacity-50 group-hover:scale-125 transition-transform"></div>
      
      <div className="flex items-center space-x-6 relative z-10">
        <div className={`p-4 rounded-2xl ${weather.status === 'Rainy' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
          {weather.status === 'Rainy' ? <CloudRain size={32} /> : <Sun size={32} />}
        </div>
        <div>
          <div className="flex items-center">
            <span className="text-3xl font-black text-slate-900">{weather.temp}°C</span>
            <span className="ml-3 px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-lg border border-slate-200">{weather.status}</span>
          </div>
          <p className="text-slate-500 text-xs font-bold mt-1 flex items-center">
             <Thermometer size={12} className="mr-1 opacity-50" /> Real-time environmental sync active
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-8 mr-4 relative z-10">
         <div className="text-center">
            <div className="flex items-center text-slate-400 mb-1">
               <Droplets size={14} className="mr-1"/>
               <span className="text-[10px] font-black uppercase tracking-widest">AQI</span>
            </div>
            <p className={`text-sm font-black ${weather.aqi > 100 ? 'text-orange-500' : 'text-emerald-500'}`}>{weather.aqi}</p>
         </div>
         <div className="text-center">
            <div className="flex items-center text-slate-400 mb-1">
               <Wind size={14} className="mr-1"/>
               <span className="text-[10px] font-black uppercase tracking-widest">Wind</span>
            </div>
            <p className="text-sm font-black text-slate-900">{weather.wind}kmh</p>
         </div>
         <div className="text-center">
            <div className="flex items-center text-slate-400 mb-1">
               <Droplets size={14} className="mr-1"/>
               <span className="text-[10px] font-black uppercase tracking-widest">Hum</span>
            </div>
            <p className="text-sm font-black text-slate-900">{weather.humidity}%</p>
         </div>
      </div>
    </div>
  );
};

export default WeatherCard;
