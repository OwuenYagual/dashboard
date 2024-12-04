import './App.css';
import Grid from '@mui/material/Grid2';
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import HeaderWeather from './components/HeaderWeather';

import Item from './interface/Item';

{/* Hooks */ }
import { useEffect, useState } from 'react';
import header from './interface/header';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

const convertirAHorasSegundos = (hora: String) => {
  const [hh, mm, ss] = hora.split(':').map(Number);
  return hh * 3600 + mm * 60 + ss; // Convierte a segundos
};

function App() {

  {/* Variable de estado y función de actualización */ }
  let [indicators, setIndicators] = useState<Indicator[]>([])
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))
  let [items, setItems] = useState<Item[]>([])
  let [header, setHeader] = useState<header>({
    city: '',
    alt: '',
    lon: '',
    lat: '',
  })

  {/* Hook: useEffect */ }

  useEffect(() => {


    let request = async () => { //Callback y arreglo

      {/* Referencia a las claves del LocalStorage: openWeatherMap y expiringTime */ }
      let savedTextXML = localStorage.getItem("openWeatherMap") || "";
      let expiringTime = localStorage.getItem("expiringTime");

      {/* Obtenga la estampa de tiempo actual */ }
      let nowTime = (new Date()).getTime();

      /* Verifique si es que no existe la clave expiringTime o si la estampa de tiempo actual supera el tiempo de expiración */

      if (expiringTime === null || nowTime > parseInt(expiringTime)) {

        {/* Request */ }
        let API_KEY = "cfc41c732fee2785ab8b2f6c4ab294fd"
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
        let savedTextXML = await response.text();

        {/* Tiempo de expiración */ }
        let hours = 0.01
        let delay = hours * 3600000
        let expiringTime = nowTime + delay


        {/* En el LocalStorage, almacene el texto en la clave openWeatherMap, estampa actual y estampa de tiempo de expiración */ }
        localStorage.setItem("openWeatherMap", savedTextXML)
        localStorage.setItem("expiringTime", expiringTime.toString())
        localStorage.setItem("nowTime", nowTime.toString())

        {/* DateTime */ }
        localStorage.setItem("expiringDateTime", new Date(expiringTime).toString())
        localStorage.setItem("nowDateTime", new Date(nowTime).toString())

        {/* Modificación de la variable de estado mediante la función de actualización */ }
        setOWM(savedTextXML)
      }

      if (savedTextXML) {

        {/* XML Parser */ }
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");


        {/* Arreglo para agregar los resultados */ }
        let dataToIndicators: Indicator[] = new Array<Indicator>();
        let dataToTable: Item[] = [];
        let currentHourSec = convertirAHorasSegundos(new Date().toLocaleTimeString('es-ES', {
          hour12: false,
        }));

        let name = xml.getElementsByTagName("name")[0].innerHTML || ""
        let location = xml.getElementsByTagName("location")[1]
        let latitude = location.getAttribute("latitude") || ""
        let longitude = location.getAttribute("longitude") || ""
        let altitude = location.getAttribute("altitude") || ""


        for (let i = 0; i < 10; i++) {
          let time = xml.getElementsByTagName("time")[i]

          let fromTime = time.getAttribute("from") || ""
          let toTime = time.getAttribute("to") || ""

          const regex = /\d{4}-\d{2}-\d{2}T(\d{2}:\d{2}:\d{2})/;
          let matchFromTime = fromTime.match(regex);
          let matchToTime = toTime.match(regex);

          let temperature = time.getElementsByTagName("temperature")[0]
          let tempValue = (parseFloat(temperature ? temperature.getAttribute("value") || "" : "") - 273.15).toFixed(1)

          let thermalSensation = time.getElementsByTagName("feels_like")[0]
          let thermSensValue = (parseFloat(thermalSensation ? thermalSensation.getAttribute("value") || "" : "") - 273.15).toFixed(1)

          let humidity = time.getElementsByTagName("humidity")[0]
          let humidityValue = humidity ? humidity.getAttribute("value") || "" : ""

          let precipitation = time.getElementsByTagName("precipitation")[0]
          let probability = precipitation ? precipitation.getAttribute("probability") || "" : ""

          let clouds = time.getElementsByTagName("clouds")[0]
          let cloudsValue = clouds ? clouds.getAttribute("value") || "" : ""
          let cloudsAll = clouds ? clouds.getAttribute("all") || "" : ""

          let windDirection = time.getElementsByTagName("windDirection")[0]
          let direction = windDirection ? windDirection.getAttribute("name") || "" : ""

          let windSpeed = time.getElementsByTagName("windSpeed")[0]
          let speed = windSpeed ? windSpeed.getAttribute("mps") || "" : ""
          let nameWind = windSpeed ? windSpeed.getAttribute("name") || "" : ""
          let timeRange = ""

          if (matchFromTime && matchToTime && matchFromTime[1] && matchToTime[1]) {
            let horaDesde = matchFromTime[1];
            let horaHasta = matchToTime[1];
            timeRange = `${horaDesde}-${horaHasta}`;

            let fromTimeSec = convertirAHorasSegundos(matchFromTime[1])
            let toTimeSec = convertirAHorasSegundos(matchToTime[1])
            if (currentHourSec >= fromTimeSec && currentHourSec <= toTimeSec) {

              dataToIndicators.push({ "title": "Temperature", "subtitle": "Feels like: " + thermSensValue + "°C", "value": tempValue.toString() + "°C" })

              dataToIndicators.push({ "title": "Humidity", "subtitle": "xd", "value": humidityValue + "%" })

              dataToIndicators.push({ "title": "Precipitation", "subtitle": cloudsValue, "value": probability + "%" })

              dataToIndicators.push({ "title": nameWind, "subtitle": direction, "value": speed + " m/s" })

            }

          }

          let item: Item = {
            timeFrame: timeRange,
            temp: tempValue,
            feels_like: thermSensValue,
            windSpeed: speed,
            windDirection: direction,
            humidity: humidityValue,
            clouds: cloudsAll,
            precipitation: probability
          };

          dataToTable.push(item);
        }

        {/* Modificación de la variable de estado mediante la función de actualización */ }
        setIndicators(dataToIndicators)
        setItems(dataToTable)
        setHeader({
          city: name,
          lat: latitude,
          lon: longitude,
          alt: altitude,
        })
      }
    }

    request();
  }, [owm])



  return (
    <>
      <HeaderWeather
        city={header.city}
        lat={header.lat}
        lon={header.lon}
        alt={header.alt} />

      <Grid container spacing={5}>
        {
          indicators
            .map(
              (indicator, idx) => (
                <Grid key={idx} size={{ xs: 12, sm: 3 }}>
                  <IndicatorWeather
                    title={indicator["title"]}
                    subtitle={indicator["subtitle"]}
                    value={indicator["value"]} />
                </Grid>
              )
            )
        }

        {/* Tabla */}
        <Grid size={{ xs: 12, sm: 12 }}>
          {/* Grid Anidado */}
          <Grid container spacing={2}>
            {/* Gráfico */}
            <Grid size={{ xs: 12, sm: 8 }}>
              <LineChartWeather />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <ControlWeather />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, sm: 12 }}>
          <TableWeather itemsIn={items} />
        </Grid>


      </Grid>
    </>
  )
}

export default App
