import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import Point from '../interface/Point';
import { useEffect, useState } from 'react';


interface MyProp {
  itemsIn: Point[];
  selectedVariable: number;
}

export default function LineChartWeather({ itemsIn, selectedVariable }: MyProp) {

    let[points, setPoints] = useState<Point[]>([])

    useEffect(() => {
        setPoints(itemsIn)
    }, [itemsIn])

    const getDataForVariable = () => {
        switch (selectedVariable) {
            case 0: // Temperatura
                return {
                    series: [
                        {
                            data: points.map(p => parseFloat(p.maxTemp || '0') || null),
                            label: 'Maximum temperature',
                        },
                        {
                            data: points.map(p => parseFloat(p.minTemp || '0') || null),
                            label: 'Minimum temperature',
                        },
                    ],
                    label: 'Temperature (°C)',
                };
            case 1: // Precipitación
                return {
                    series: [
                        {
                            data: points.map(p => parseFloat(p.precipitation || '0') || null), 
                            label: 'Precipitation',
                        },
                    ],
                    label: 'Precipitation (%)',
                };
            case 2: // Humedad
                return {
                    series: [
                        {
                            data: points.map(p => parseFloat(p.humidity || '0') || null), 
                            label: 'Humidity',
                        },
                    ],
                    label: 'Humidity (%)',
                };
            case 3: // Nubosidad
                return {
                    series: [
                        {
                            data: points.map(p => parseFloat(p.clouds || '0') || null), 
                            label: 'Clouds',
                        },
                    ],
                    label: 'Clouds (%)',
                };
            default:
                return {
                    series: [
                        {
                            data: points.map(p => parseFloat(p.maxTemp) || null),
                            label: 'Temperatura máxima',
                        },
                    ],
                    label: 'Temperatura (°C)',
                };
        }
    };
    
    
    let chartData = getDataForVariable();

    
    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}
        >

            {/* Componente para un gráfico de líneas */}
                <LineChart
                
                width={780}
                height={346}
                series={chartData.series}
                xAxis={[{ scaleType: 'point', data: points.map(p => p.hour), label: 'Hour' }]}
                yAxis={[{
                    label: chartData.label
                }]}
            />
            
        </Paper>
    );
}