import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import api from '../../api/axios';
import L from 'leaflet';
import 'leaflet.heat';

// Fix for default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, 13);
  return null;
};

const HeatmapLayer = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (!points || points.length === 0) return;
    const heatLayer = L.heatLayer(points, { 
      radius: 25, 
      blur: 15, 
      maxZoom: 17,
      gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
    }).addTo(map);
    return () => map.removeLayer(heatLayer);
  }, [points, map]);
  return null;
};

const WeatherMap = () => {
  const [position, setPosition] = useState([28.6139, 77.2090]);
  const [weather, setWeather] = useState(null);
  const [heatPoints, setHeatPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setPosition([latitude, longitude]);
            fetchData(latitude, longitude);
          },
          () => {
            setError("Location access timed out or denied.");
            fetchData(position[0], position[1]);
          },
          { timeout: 10000 }
        );
      } else {
        setError("Location not supported.");
        fetchData(position[0], position[1]);
      }
    };
    initLocation();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchData(position[0], position[1]);
    }, 300000);
    return () => clearInterval(interval);
  }, [position]);

  const fetchData = async (lat, lon) => {
    try {
      setLoading(true);
      const [weatherRes, heatRes] = await Promise.all([
        api.get(`/weather?lat=${lat}&lon=${lon}`),
        api.get(`/heatmap?lat=${lat}&lon=${lon}`)
      ]);
      setWeather(weatherRes.data);
      setHeatPoints(heatRes.data.points);
      setLoading(false);
    } catch (err) {
      setError("Environmental Sync Interrupted.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Map Section */}
      <div className="relative h-[450px] w-full rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200 group">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-2xl shadow-xl border border-white/50 flex items-center space-x-3">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Risk Visualization Engine LIVE</span>
        </div>
        
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={position} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <HeatmapLayer points={heatPoints} />
          <Marker position={position}>
            <Popup className="rounded-xl overflow-hidden shadow-2xl">
              <div className="p-2">
                <p className="font-black text-slate-900 border-b border-slate-50 mb-2 pb-1">{weather?.city || "Detecting Node..."}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network Locked</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
           <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
           <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Analyzing Environmental Matrix...</p>
        </div>
      ) : weather && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* Current Weather Card */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-50 rounded-full opacity-40 group-hover:scale-125 transition-transform duration-700"></div>
            <div className="relative z-10">
              <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-6 bg-slate-50 inline-block px-3 py-1.5 rounded-lg border border-slate-100">Sensor Data: {weather.city}</h3>
              <div className="flex items-center space-x-10 mb-8">
                <span className="text-7xl font-black text-slate-900 tracking-tighter drop-shadow-sm">{Math.round(weather.temp)}°C</span>
                <div className="pl-8 border-l-2 border-slate-50">
                  <p className="text-2xl font-black text-slate-800 capitalize leading-none mb-1">{weather.condition}</p>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{weather.description}</p>
                </div>
              </div>
              <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                   <div className={`w-3 h-3 rounded-full ${weather.currentRisk === 'HIGH' ? 'bg-red-500' : 'bg-amber-400'}`}></div>
                   <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Risk Level: {weather.currentRisk}</span>
                 </div>
                 <span className="text-[10px] font-bold text-slate-400">Node Sync Complete</span>
              </div>
            </div>
          </div>

          {/* AI Prediction Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-900 p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-900/10 text-white relative overflow-hidden group">
            <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full opacity-20 blur-3xl group-hover:bg-indigo-400/10 transition-colors"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-indigo-200 font-bold text-[10px] uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10">Gemini Prediction engine</h3>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
                </div>
                <div className="mb-6">
                  <p className="text-indigo-100 text-xs font-semibold mb-2">Next-Day Forecast Model:</p>
                  <p className="text-2xl font-black leading-tight bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                    {weather.prediction?.split('|')[0] || "Calculating Risk..."}
                  </p>
                </div>
              </div>
              <div className="p-6 bg-white/10 rounded-2xl border border-white/5 backdrop-blur-md">
                <p className="text-xs font-medium text-indigo-100 leading-relaxed italic">
                  "{weather.prediction?.split('|')[1]?.trim() || "Analysis pending sensory update."}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherMap;
