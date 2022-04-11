import React,{useRef} from 'react';
import {Card, CardHeader, CardContent, Typography} from '@material-ui/core';
import {Pie} from 'react-chartjs-2';
// import { PieChart } from 'react-minimal-pie-chart';

import useChart from '../../useChart';
import useStyles from './styles';
import useTransactions from '../../useTransaction';

const Details = ({title}) => {
    const canvasRef = useRef(null);
    const {total} = useTransactions(title);
    const {chartData} = useTransactions(title);
    const classes = useStyles();

    console.log(chartData);
    return (
    <Card className={title==='Income'?classes.income:classes.expense}>
        <CardHeader title={title} />
        <CardContent>
        <Typography variant="h5">₹{total}</Typography>
            {/* {<canvas id="Chart" ref={canvasRef} width="400" height="100" />}
            {useChart(canvasRef,chartData)}; */}
        </CardContent>
    </Card>
  )
}

export default Details