// Refactor del archivo App.tsx con complejidad cognitiva reducida
import './App.css';
import Grid from '@mui/material/Grid2';
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import HeaderWeather from './components/HeaderWeather';

import Item from './interface/Item';
import header from './interface/header';
import Point from './interface/Point';
import { useEffect, useState } from 'react';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

const convertirAHorasSegundos = (hora: String) => {
  const [hh, mm, ss] = hora.split(':').map(Number);
  return hh * 3600 + mm * 60 + ss;
};

const fetchAndStoreWeatherData = async (nowTime: number): Promise<string> => {
  const API_KEY = "cfc41c732fee2785ab8b2f6c4ab294fd";
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
  const xmlText = await response.text();

  const delay = 0.01 * 3600000;
  const expiringTime = nowTime + delay;

  localStorage.setItem("openWeatherMap", xmlText);
  localStorage.setItem("expiringTime", expiringTime.toString());
  localStorage.setItem("nowTime", nowTime.toString());
  localStorage.setItem("expiringDateTime", new Date(expiringTime).toString());
  localStorage.setItem("nowDateTime", new Date(nowTime).toString());

  return xmlText;
};

const parseXMLData = (xmlText: string, currentHourSec: number) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "application/xml");

  const indicators: Indicator[] = [];
  const points: Point[] = [];
  const items: Item[] = [];

  const name = xml.getElementsByTagName("name")[0]?.innerHTML || "";
  const location = xml.getElementsByTagName("location")[1];
  const latitude = location?.getAttribute("latitude") || "";
  const longitude = location?.getAttribute("longitude") || "";
  const altitude = location?.getAttribute("altitude") || "";

  const timeNodes = xml.getElementsByTagName("time");
  const regex = /\d{4}-\d{2}-\d{2}T(\d{2}:\d{2}:\d{2})/;

  for (let i = 0; i < 8; i++) {
    const time = timeNodes[i];
    const fromTime = time.getAttribute("from") || "";
    const toTime = time.getAttribute("to") || "";
    const matchFrom = fromTime.match(regex);
    const matchTo = toTime.match(regex);
    const fromHour = matchFrom?.[1];
    const toHour = matchTo?.[1];

    const temp = (v: string | null) => (parseFloat(v || "") - 273.15).toFixed(1);

    const tempValue = temp(time.querySelector("temperature")?.getAttribute("value"));
    const tempMax = temp(time.querySelector("temperature")?.getAttribute("max"));
    const tempMin = temp(time.querySelector("temperature")?.getAttribute("min"));
    const feels = temp(time.querySelector("feels_like")?.getAttribute("value"));

    const humidity = time.querySelector("humidity")?.getAttribute("value") || "";
    const precipitation = time.querySelector("precipitation")?.getAttribute("probability") || "";
    const cloudsValue = time.querySelector("clouds")?.getAttribute("value") || "";
    const cloudsAll = time.querySelector("clouds")?.getAttribute("all") || "";
    const direction = time.querySelector("windDirection")?.getAttribute("name") || "";
    const speed = time.querySelector("windSpeed")?.getAttribute("mps") || "";
    const windName = time.querySelector("windSpeed")?.getAttribute("name") || "";
    const nameRain = time.querySelector("symbol")?.getAttribute("name") || "";

    const timeRange = fromHour && toHour ? `${fromHour}-${toHour}` : "";

    if (fromHour && toHour) {
      const fromSec = convertirAHorasSegundos(fromHour);
      const toSec = convertirAHorasSegundos(toHour);

      if (currentHourSec >= fromSec && currentHourSec <= toSec) {
        indicators.push(
          { title: "Temperature", subtitle: `Feels like: ${feels}°C`, value: `${tempValue}°C` },
          { title: "Humidity", subtitle: cloudsValue, value: `${humidity}%` },
          { title: "Precipitation", subtitle: nameRain, value: `${precipitation}%` },
          { title: "Wind", subtitle: `${windName} ${direction}`, value: `${speed} m/s` }
        );
      }
    }

    items.push({
      timeFrame: timeRange,
      temp: tempValue,
      feels_like: feels,
      windSpeed: speed,
      windDirection: direction,
      humidity,
      clouds: cloudsAll,
      precipitation
    });

    points.push({
      maxTemp: tempMax,
      minTemp: tempMin,
      hour: fromHour,
      precipitation,
      humidity,
      clouds: cloudsAll
    });
  }

  return { indicators, points, items, header: { city: name, lat: latitude, lon: longitude, alt: altitude } };
};

function App() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"));
  const [items, setItems] = useState<Item[]>([]);
  const [selectedVariable, setSelectedVariable] = useState(0);
  const [points, setPoints] = useState<Point[]>([]);
  const [headerData, setHeader] = useState<header>({ city: '', alt: '', lon: '', lat: '' });

  useEffect(() => {
    const request = async () => {
      let savedText = localStorage.getItem("openWeatherMap") || "";
      let expTime = parseInt(localStorage.getItem("expiringTime") || "0");
      const now = Date.now();

      if (!expTime || now > expTime) {
        savedText = await fetchAndStoreWeatherData(now);
        setOWM(savedText);
      }

      if (savedText) {
        const currentHour = convertirAHorasSegundos(new Date().toLocaleTimeString("es-ES", { hour12: false }));
        const { indicators, points, items, header } = parseXMLData(savedText, currentHour);
        setIndicators(indicators);
        setPoints(points);
        setItems(items);
        setHeader(header);
      }
    };
    request();
  }, [owm]);

  return (
    <>
      <HeaderWeather {...headerData} />
      <Grid container spacing={5}>
        {indicators.map((indicator, idx) => (
          <Grid key={idx} id="cardIndicator" size={{ xs: 12, sm: 3 }}>
            <IndicatorWeather {...indicator} />
          </Grid>
        ))}
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <LineChartWeather itemsIn={points} selectedVariable={selectedVariable} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <ControlWeather onVariableChange={setSelectedVariable} selectedVariable={selectedVariable} />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TableWeather itemsIn={items} />
        </Grid>
      </Grid>
    </>
  );
}

export default App;