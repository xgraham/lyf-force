import * as React from 'react';
import {useTheme} from '@mui/material/styles';
import {LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip} from 'recharts';
import Typography from "@mui/material/Typography";
import {CartesianGrid} from "recharts";
import {useState} from "react";

const E = 2.71828182845904

function createData(deltapct, gain) {
    return {deltapct: deltapct, gain: gain}
}

function getLPValue(princeChange){
    const value = (1+(parseFloat(princeChange)/100))
    return Math.pow(value,.5)
}
function getPositionValue(assetprice,multi, LPValue, apr, time ){
    const step1 = assetprice * multi * LPValue;
    const avg1 = assetprice * multi * LPValue;
    const avg2 = assetprice * multi
    const avg = (avg1+avg2)/2
    const step3 = ((apr/100)*time/365)
    const exp = Math.pow(E, step3)-1
    const step5 = avg * exp
    return step1 + step5
}

function getDebtValue(assetprice, multi, borrowapr, time ){
    const leverage = multi - 1
    const borrowValue = leverage * assetprice
    const step3 = ((borrowapr/100) * (parseInt(time)/365))

    const exp = Math.pow(E,step3 )
    return borrowValue * exp
}

function getChange(price, delta) {
    return parseFloat(price) + (price * (delta / 100))
}


export default function Chart(props) {
    const theme = useTheme();
    // assetprice:0,multi:1,borrowapr:0,apy:0, time:1
    const [data, setData] = useState({});


    React.useEffect(() => {
        const inputData = {
            assetprice: props.data.assetprice,
            multi: props.data.multi,
            borrowapr: props.data.borrowapr,
            apr: props.data.apy,
            time: props.data.time,
            liquidation: props.data.liquidationthreshold
        }

        const newDataSet = []
        for (let i = -100; i < 101; i++) {
            const newPrice = getChange(inputData.assetprice, i)
            const profit = parseFloat(newPrice-inputData.assetprice)
            const lpval = getLPValue(i)
            const posit = getPositionValue(inputData.assetprice,inputData.multi, lpval, inputData.apr, inputData.time )
            const debt = getDebtValue(inputData.assetprice, inputData.multi,inputData.borrowapr,inputData.time)
            const debtRatio = debt / posit
            const equity = posit - debt
            let farm_profit = equity - inputData.assetprice
            if (debtRatio>(parseFloat(parseInt(inputData.liquidation)/100))){
                farm_profit = (inputData.assetprice * .1) - inputData.assetprice
            }
            newDataSet.push({deltapct: i, profit: Math.round((profit + Number.EPSILON) * 100) / 100,farm_profit: Math.round((farm_profit + Number.EPSILON) * 100) / 100 })
            if (i === 100) {
                setData(newDataSet)
            }
        }

    }, [props])
    React.useEffect(() => {

    }, [data])


    return (
        <React.Fragment>

            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Farm vs HODL Calculator
            </Typography>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24,
                    }}
                    height={850}
                >
                    <XAxis
                        dataKey="deltapct"
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}
                        allowDuplicatedCategory={false}
                        type="number"
                        >
                        <Label
                            value="% Change in Supplied Asset Value"
                            position="top"
                            offset={15}
                        />
                    </XAxis>

                    <YAxis
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}
                    >
                        <Label
                            angle={270}
                            position="left"
                            style={{
                                textAnchor: 'middle',
                                fill: theme.palette.text.primary,
                                ...theme.typography.body1,
                            }}
                        >
                            Profit (Equity - Initial Deposit)
                        </Label>
                    </YAxis>

                    <Line data={data} type="monotone" name={'HODL PROFIT'} dataKey="profit" stroke={theme.palette.secondary.main} dot={false}/>
                    <Line data={data} type="monotone" name={'FARM PROFIT'} dataKey="farm_profit" stroke={theme.palette.primary.main} dot={false}/>
                    <Tooltip/>
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}
