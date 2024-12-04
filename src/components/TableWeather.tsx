import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Item from '../interface/Item';
import { useEffect, useState } from 'react';

interface MyProp {
  itemsIn: Item[];
}

export default function BasicTable(props: MyProp) {

  let[rows, setRows] = useState<Item[]>([])
  useEffect(() => {
    setRows(props.itemsIn)
  }, [props])

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Time Frame</TableCell>
            <TableCell align="center">Temp(°C)</TableCell>
            <TableCell align="center">thermal Sensation</TableCell>
            <TableCell align="center">Wind(m/s)</TableCell>
            <TableCell align="center">Wind Dirección</TableCell>
            <TableCell align="center">Humidity(%)</TableCell>
            <TableCell align="center">Cloudiness(%)</TableCell>
            <TableCell align="center">Precipitation(%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.timeFrame}
              </TableCell>
              <TableCell align="center">{row.temp}</TableCell>
              <TableCell align="center">{row.feels_like}</TableCell>
              <TableCell align="center">{row.windSpeed}</TableCell>
              <TableCell align="center">{row.windDirection}</TableCell>
              <TableCell align="center">{row.humidity}</TableCell>
              <TableCell align="center">{row.clouds}</TableCell>
              <TableCell align="center">{row.precipitation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}