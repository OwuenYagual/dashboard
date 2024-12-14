import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import Point from '../interface/Point';
import { useEffect, useState } from 'react';


interface MyProp {
  itemsIn: Point[];
}

export default function LineChartWeather(props: MyProp) {

    let[points, setPoints] = useState<Point[]>([])
      useEffect(() => {
        setPoints(props.itemsIn)
    }, [props])

    // Variables para acumular los datos de todas las series
    let maxTempArray: number[] = [];
    let minTempArray: number[] = [];
    let xLabelsArray: string[] = [];

    // Recorre los puntos y llena los arrays de datos
    points.forEach((point) => {
        maxTempArray.push(point.maxTemp); 
        minTempArray.push(point.minTemp); 
        xLabelsArray.push(point.hour); 
    });
    
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
                
                width={800}
                height={250}
                series={[
                    { data: maxTempArray, label: 'Temperatura máxima' },
                    { data: minTempArray, label: 'Temperatura mínima' },
                ]}
                xAxis={[{ scaleType: 'point', data: xLabelsArray }]}
            />
            
        </Paper>
    );
}