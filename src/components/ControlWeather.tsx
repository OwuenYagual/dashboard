// ControlWeather.tsx
import { useRef } from 'react';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface ControlWeatherProps {
  selectedVariable: number;
  onVariableChange: (value: number) => void;
}

interface WeatherVariable {
  name: string;
  description: string;
}

const weatherOptions: WeatherVariable[] = [
  {
    name: 'Temperature',
    description:
      'Level of heat or cold in the environment, expressed in degrees Celsius (°C)',
  },
  {
    name: 'Precipitation',
    description:
      'Amount of water that falls on a surface in a specific period.',
  },
  {
    name: 'Humidity',
    description:
      'Amount of water vapor present in the air, generally expressed as a percentage.',
  },
  {
    name: 'Clouds',
    description:
      'Degree of sky coverage by clouds, affecting visibility and the amount of sunlight received.',
  },
];

export default function ControlWeather({
  selectedVariable,
  onVariableChange,
}: ControlWeatherProps) {
  const descriptionRef = useRef<HTMLDivElement>(null);

  const handleChange = (event: SelectChangeEvent) => {
    const idx = parseInt(event.target.value);
    onVariableChange(idx);

    if (descriptionRef.current) {
      descriptionRef.current.innerHTML =
        idx >= 0 ? weatherOptions[idx].description : '';
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography mb={2} component="h3" variant="h6" color="primary">
        Variables Meteorológicas
      </Typography>

      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="simple-select-label">Variables</InputLabel>
          <Select
            labelId="simple-select-label"
            id="simple-select"
            label="Variables"
            defaultValue={selectedVariable.toString()}
            onChange={handleChange}
          >
            {weatherOptions.map((item, index) => (
              <MenuItem key={item.name} value={index}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Typography ref={descriptionRef} mt={2} component="p" color="text.secondary" />
    </Paper>
  );
}