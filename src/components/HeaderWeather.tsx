import { Typography, Box } from "@mui/material"
import header from "../interface/header"


export default function HeaderWeather(config: header) {
    return (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            mb: 3,
        }}
    >
        <Typography component="h1" variant="h4">
            {config.city}, Ecuador
        </Typography>
        <Typography component="p" variant="subtitle1">
            Alt: {config.alt} Lat: {config.lat}, Lon: {config.lon}
        </Typography>
    </Box>
    )
}