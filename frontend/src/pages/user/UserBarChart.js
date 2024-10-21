
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function UserBarChart({ data }) {

  const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
  return (
    <>
    <BarChart
        dataset={sortedData}
        xAxis={[
          {
            scaleType: 'band',
            dataKey: 'date',
            label: 'Date Applied', 
          },
        ]}
      yAxis={[
        {
          scaleType: 'linear',
          label: 'Jobs Applied'
        }
      ]}
      series={[{dataKey :"count",
      label: 'Number of Jobs'}]}
      width={500}
      height={220}
      // barSize={}
    />
    </>
  );
}
