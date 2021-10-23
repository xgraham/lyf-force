import * as React from 'react';
import {useTheme} from '@mui/material/styles';
import {LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip, Legend} from 'recharts';
import Typography from "@mui/material/Typography";
import {useState} from "react";
import {Checkbox, createTheme, FormControlLabel, Grid, Paper, Switch} from "@mui/material";
import Box from "@mui/material/Box";
import {grey} from "@mui/material/colors";

const E = 2.71828182845904

function createData(deltapct, gain) {
    return {deltapct: deltapct, gain: gain}
}

function getLPValue(priceChange) {
    const value = (1 + (parseFloat(priceChange) / 100))
    return Math.pow(value, .5)
}

function getPositionValue(assetprice, multi, LPValue, apr, time) {
    const step1 = assetprice * multi * LPValue;
    const avg1 = assetprice * multi * LPValue;
    const avg2 = assetprice * multi
    const avg = (avg1 + avg2) / 2
    const step3 = ((apr / 100) * time / 365)
    const exp = Math.pow(E, step3) - 1
    const step5 = avg * exp
    return step1 + step5
}

function getDebtValue(assetprice, multi, borrowapr, time, deltapct) {
    const leverage = multi - 1
    const borrowValue = leverage * assetprice * (1 + parseFloat(deltapct / 100))
    const step3 = ((borrowapr / 100) * (parseInt(time) / 365))

    const exp = Math.pow(E, step3)
    return borrowValue * exp
}

function getChange(price, delta) {
    return parseFloat(price) + (price * (delta / 100))
}


export default function ShortChart(props) {
    const theme = createTheme({
        palette: {
            mode: 'dark',
        },
    });
    // assetprice:0,multi:1,borrowapr:0,apy:0, time:1
    const [data, setData] = useState({});


    React.useEffect(() => {
        const inputData = {
            valueSupplied: props.data.assetprice,
            multi: props.data.multi,
            borrowapr: props.data.borrowapr,
            apr: props.data.apy,
            time: props.data.time,
            liquidation: props.data.liquidationthreshold
        }


        const newDataSet = []
        for (let i = -100; i < 101; i++) {
            const newPrice = getChange(inputData.valueSupplied, i)
            const lpval = getLPValue(i)
            const posit = getPositionValue(inputData.valueSupplied, inputData.multi, lpval, inputData.apr, inputData.time)
            const debt = getDebtValue(inputData.valueSupplied, inputData.multi, inputData.borrowapr, inputData.time, i)
            const debtRatio = debt / posit
            const equity = posit - debt
            const profit = parseFloat(equity - inputData.valueSupplied)
            let farm_profit = equity - inputData.valueSupplied
            if (debtRatio > (parseFloat(parseInt(inputData.liquidation) / 100))) {
                farm_profit = (inputData.valueSupplied * .1) - inputData.valueSupplied
            }
            newDataSet.push({
                deltapct: i,
                profit: 0,
                farm_profit: Math.round((farm_profit + Number.EPSILON) * 100) / 100,
                debt: Math.round((debt + Number.EPSILON) * 100) / 100,
                positVal: Math.round((posit + Number.EPSILON) * 100) / 100
            })
            if (i === 100) {
                setData(newDataSet)
            }
        }

    }, [props])
    React.useEffect(() => {

    }, [data])
    const CustomTooltip = ({active, payload, label}) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`Borrowed Asset Value : ${label}%`}</p>
                    {displayProfit && <p className="label">{`Profit: $${payload[1].value}`}</p>}
                    {displayDebt && <p className="label">{`Debt Value: $${payload[2].value}`}</p>}
                    {displayPosit && <p className="label">{`Position Value: $${payload[3].value}`}</p>}
                </div>
            );
        }

        return null;
    };
    const [displayDebt, setDisplayDebt] = React.useState(true)
    const [displayPosit, setDisplayPosit] = React.useState(true)
    const [displayProfit, setDisplayProfit] = React.useState(true)

    const handleDisplayDebtline = () => {
        setDisplayDebt(!displayDebt)
    }

    const handleDisplayPositValline = () => {
        setDisplayPosit(!displayPosit)
    }

    const handleDisplayProfitline = () => {
        setDisplayProfit(!displayProfit)

    }

    return (
        <React.Fragment>
            <Grid spacing={1}>
                <Grid item>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        Leveraged Short
                    </Typography>
                    <ResponsiveContainer aspect={1.6}>
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
                                    value="% Change in Borrowed Asset Value"
                                    position="top"
                                    offset={15}> </Label>
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
                                        fill: 'white',
                                        ...theme.typography.body1,
                                    }}
                                >
                                    Profit (Equity - Borrowed Asset Value)
                                </Label>
                            </YAxis>

                            <Line data={data} type="monotone" name={'Baseline'} dataKey="profit"
                                  stroke={"black"}
                                  dot={false}/>

                            {displayProfit &&
                            <Line data={data} type="monotone" name={'Profit'} dataKey="farm_profit"
                                  stroke={"Green"}
                                  dot={false}/>
                            }
                            {displayDebt &&
                            <Line data={data} type="monotone" name={'Debt'} dataKey="debt" stroke={"red"}
                                  dot={false}/>
                            }
                            {displayPosit &&
                            <Line data={data} type="monotone" name={'Position Value'} dataKey="positVal"
                                  stroke={theme.palette.primary.dark} dot={false}/>
                            }

                            <Tooltip contentStyle={{backgroundColor: 'grey', border: '1px solid black'}}
                                     content={CustomTooltip}/>
                            <Legend verticalAlign="top" height={36}/>
                        </LineChart>
                    </ResponsiveContainer>
                </Grid>
                <Grid item sx={{ml: '10px', mb: '10px'}}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sx={{mb: '10px'}}>
                            <Typography variant="body2">
                                Display Lines:
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControlLabel control=<Switch onChange={handleDisplayDebtline} disableRipple
                                              defaultChecked size="small"/>label="Debt"/>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControlLabel control=<Switch onChange={handleDisplayPositValline} disableRipple
                                              defaultChecked size="small"/>label="Position Value"/>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControlLabel control=<Switch onChange={handleDisplayProfitline} disableRipple
                                              defaultChecked size="small"/>label="Profit"/>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
        </React.Fragment>
    );
}
