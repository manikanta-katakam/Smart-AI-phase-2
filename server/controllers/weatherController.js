import axios from 'axios';
import { evaluateRisk, getAIPrediction } from '../services/riskEngine.js';

export const getWeatherData = async (req, res) => {
  const { lat, lon } = req.query;
  const io = req.app.get('io'); // Extract Socket.io from app context

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and Longitude are required' });
  }

  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    const { main, weather, name, coord } = response.data;

    const weatherData = {
      city: name,
      temp: main.temp,
      condition: weather[0].main,
      description: weather[0].description,
      icon: weather[0].icon,
      lat: coord.lat,
      lon: coord.lon
    };

    // 1. Evaluate Current Risk & Emit Alerts via Socket.IO
    const currentRisk = await evaluateRisk(weatherData, io, req.user._id);

    // 2. Fetch AI Prediction (Gemini)
    const aiNote = await getAIPrediction(weatherData);

    res.json({
      ...weatherData,
      currentRisk,
      prediction: aiNote
    });
  } catch (error) {
    console.error('Weather Fetch Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
};
