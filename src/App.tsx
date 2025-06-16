// App.tsx
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
  title?: string;
  subtitle?: string;
  value?: string;
}

const convertirAHorasSegundos = (hora: string): number => {
  const [hh, mm, ss] = hora.split(':').map(Number);
  return hh * 3600 + mm * 60 + ss;
};

const fetchXMLFromAPI = async (): Promise<string> => {
  const API_KEY = "cfc41c732fee2785ab8b2f6c4ab294fd";
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
  return await response.text();
};

const saveToLocalStorage = (xml: string, now: number, expire: number) => {
  localStorage.setItem("openWeatherMap", xml);
  localStorage.setItem("expiringTime", expire.toString());
  localStorage.setItem("nowTime", now.toString());
  localStorage.setItem("expiringDateTime", new Date(expire).toString());
  localStorage.setItem("nowDateTime", new Date(now).toString());
};

const getLocation = (xml: Document) => {
  const location = xml.getElementsByTagName("location")[1];
  return {
    lat: location?.getAttribute("latitude") || "",
    lon: location?.getAttribute("longitude") || "",
    alt: location?.getAttribute("altitude") || ""
  };
};

const getCityName = (xml: Document): string => {
  return xml.getElementsByTagName("name")[0]?.innerHTML || "";
};

const parseForecast = (xml: Document, currentHourSec: number) => {
  const indicators: Indicator[] = [];
  const points: Point[] = [];
  const items: Item[] = [];

  const times = xml.getElementsByTagName("time");
  for (let i = 0; i < 8; i++) {
    const time = times[i];
    const from = time.getAttribute("from") || "";
    const to = time.getAttribute("to") || "";
    const regex = /\d{4}-\d{2}-\d{2}T(\d{2}:\d{2}:\d{2})/;
    const matchFrom = from.match(regex);
    const matchTo = to.match(regex);
    if (!matchFrom || !matchTo) continue;

    const [fromHour, toHour] = [matchFrom[1], matchTo[1]];
    const fromSec = convertirAHorasSegundos(fromHour);
    const toSec = convertirAHorasSegundos(toHour);
    const inRange = currentHourSec >= fromSec && currentHourSec <= toSec;

    const getAttr = (tag: string, attr: string) => {
      const el = time.getElementsByTagName(tag)[0];
      return el?.getAttribute(attr) || "";
    };

    const temp = parseFloat(getAttr("temperature", "value")) - 273.15;
    const tempMax = parseFloat(getAttr("temperature", "max")) - 273.15;
    const tempMin = parseFloat(getAttr("temperature", "min")) - 273.15;
    const therm = parseFloat(getAttr("feels_like", "value")) - 273.15;

    const humidity = getAttr("humidity", "value");
    const rain = getAttr("symbol", "name");
    const prob = getAttr("precipitation", "probability");
    const clouds = getAttr("clouds", "value");
    const cloudsAll = getAttr("clouds", "all");
    const windDir = getAttr("windDirection", "name");
    const windSpeed = getAttr("windSpeed", "mps");
    const windName = getAttr("windSpeed", "name");

    const timeRange = `${fromHour}-${toHour}`;

    if (inRange) {
      indicators.push(
        { title: "Temperature", subtitle: `Feels like: ${therm.toFixed(1)}°C`, value: `${temp.toFixed(1)}°C` },
        { title: "Humidity", subtitle: clouds, value: `${humidity}%` },
        { title: "Precipitation", subtitle: rain, value: `${prob}%` },
        { title: "Wind", subtitle: `${windName} ${windDir}`, value: `${windSpeed} m/s` }
      );
    }

    items.push({
      timeFrame: timeRange,
      temp: temp.toFixed(1),
      feels_like: therm.toFixed(1),
      windSpeed,
      windDirection: windDir,
      humidity,
      clouds: cloudsAll,
      precipitation: prob
    });

    points.push({
      maxTemp: tempMax.toFixed(1),
      minTemp: tempMin.toFixed(1),
      hour: fromHour,
      precipitation: prob,
      humidity,
      clouds: cloudsAll
    });
  }
  return { indicators, items, points };
};

function App() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"));
  const [items, setItems] = useState<Item[]>([]);
  const [selectedVariable, setSelectedVariable] = useState(0);
  const [points, setPoints] = useState<Point[]>([]);
  const [header, setHeader] = useState<header>({ city: '', alt: '', lon: '', lat: '' });

  useEffect(() => {
    const request = async () => {
      const saved = localStorage.getItem("openWeatherMap") || "";
      const exp = parseInt(localStorage.getItem("expiringTime") || "0");
      const now = Date.now();

      if (!exp || now > exp) {
        const xmlText = await fetchXMLFromAPI();
        const delay = 0.01 * 3600000;
        const newExp = now + delay;
        saveToLocalStorage(xmlText, now, newExp);
        setOWM(xmlText);
      }

      const xmlText = localStorage.getItem("openWeatherMap");
      if (!xmlText) return;

      const xml = new DOMParser().parseFromString(xmlText, "application/xml");
      const currentSec = convertirAHorasSegundos(new Date().toLocaleTimeString('es-ES', { hour12: false }));
      const { indicators, items, points } = parseForecast(xml, currentSec);

      setIndicators(indicators);
      setItems(items);
      setPoints(points);
      setHeader({ city: getCityName(xml), ...getLocation(xml) });
    };

    request();
  }, [owm]);

  return (
    <>
      <HeaderWeather {...header} />

      <Grid container spacing={5}>
        {indicators.map((indicator, idx) => (
          <Grid id="cardIndicator" key={`${indicator.title}-${idx}`} size={{ xs: 12, sm: 3 }}>
            <IndicatorWeather {...indicator} />
          </Grid>
        ))}

        <Grid size={{ xs: 12, sm: 12 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <LineChartWeather itemsIn={points} selectedVariable={selectedVariable} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <ControlWeather onVariableChange={setSelectedVariable} selectedVariable={selectedVariable} />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, sm: 12 }}>
          <TableWeather itemsIn={items} />
        </Grid>
      </Grid>
    </>
  );
}

export default App;