import { Typography } from "@mui/material";
import header from "../interface/header";

export default function HeaderWeather(config: header) {
    return (
        <header>
            {/* Título de la ciudad ajustado al contenedor */}
            <Typography
                component="h1"
                variant="h6"
                sx={{ 
                    fontWeight: 'bold', 
                    flexGrow: 1, 
                    textOverflow: 'ellipsis', 
                    overflow: 'hidden', 
                    whiteSpace: 'nowrap' // Evita que el texto se salga del contenedor
                }}
            >
                {config.city}, Ecuador
            </Typography>

            {/* Coordenadas ajustadas al contenedor */}
            <Typography
                component="p"
                variant="body2"
                sx={{ 
                    flexGrow: 1, 
                    textAlign: 'right', 
                    textOverflow: 'ellipsis', 
                    overflow: 'hidden', 
                    whiteSpace: 'nowrap' // Evita que el texto se salga del contenedor
                }}
            >
                Alt: {config.alt} Lat: {config.lat}, Lon: {config.lon}
            </Typography>
        </header>
    );
}
