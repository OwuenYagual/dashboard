{/* Hooks */ }
import { useRef } from 'react';

{/* Componentes MUI */ }
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

{/* Interfaz SelectChangeEvent */ }
import Select, { SelectChangeEvent } from '@mui/material/Select';
interface ControlWeatherProps {
    selectedVariable: number;
    onVariableChange: (value: number) => void;
}

export default function ControlWeather({ selectedVariable, onVariableChange }: ControlWeatherProps) {

    {/* Constante de referencia a un elemento HTML */ }
    const descriptionRef = useRef<HTMLDivElement>(null);

    {/* Variable de estado y función de actualización */ }

    {/* Arreglo de objetos */ }
    let items = [
        { "name": "Temperature", "description": "Level of heat or cold in the environment, expressed in degrees Celsius (°C)"},
        { "name": "Precipitation", "description": "Amount of water that falls on a surface in a specific period." },
        { "name": "Humidity", "description": "Amount of water vapor present in the air, generally expressed as a percentage." },
        { "name": "Clouds", "description": "Degree of sky coverage by clouds, affecting visibility and the amount of sunlight received." }
    ]

    {/* Arreglo de elementos JSX */ }
    let options = items.map((item, key) => <MenuItem key={key} value={key}>{item["name"]}</MenuItem>)

    {/* Manejador de eventos */ }
    const handleChange = (event: SelectChangeEvent) => {

        let idx = parseInt(event.target.value)
        onVariableChange(idx);

        {/* Modificación de la referencia descriptionRef */}
        if (descriptionRef.current !== null) {
            descriptionRef.current.innerHTML = (idx >= 0) ? items[idx]["description"] : ""
        }

    };

    {/* JSX */ }
    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}
        >

            <Typography mb={2} component="h3" variant="h6" color="primary">
                Variables Meteorológicas
            </Typography>

            <Box sx={{ minWidth: 120}}>

                <FormControl fullWidth>
                    <InputLabel id="simple-select-label">Variables</InputLabel>
                    <Select
                        labelId="simple-select-label"
                        id="simple-select"
                        label="Variables"
                        defaultValue={selectedVariable.toString()}
                        onChange={handleChange}
                    >
                        {/*<MenuItem key="-1" value="-1" disabled>Seleccione una variable</MenuItem>*/}

                        {options}

                    </Select>
                </FormControl>

            </Box>

            {/* Use la variable de estado para renderizar del item seleccionado */}
            {/*<Typography mt={2} component="p" color="text.secondary"> {
                (selected >= 0) ? items[selected]["description"] : ""
            }
            </Typography>*/}

            <Typography ref={descriptionRef} mt={2} component="p" color="text.secondary" />


        </Paper>
    )
}