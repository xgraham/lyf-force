import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Chart from "../modules/Chart";
import {
    Card,
    CardContent,
    Container,
    Grid,
    InputAdornment,
    Paper,
    Slider,
    TextField,
    Tooltip,
    tooltipClasses
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useState} from "react";
import styled from "@emotion/styled";
import ShortChart from "../modules/ShortChart";

const drawerWidth = 240;

function ShortAsset() {
    const [data, setData] = useState({
        assetprice: 100,
        multi: 1,
        borrowapr: 0,
        apy: 0,
        time: 1,
        liquidationthreshold: 85
    });

    const handleAssetPriceChange = (event) => {
        setData({...data, valueSupplied: event.target.value});
    }
    const handleLeverageChange = (event) => {
        setData({...data, multi: event.target.value});

    }

    const handleAPYChange = (event) => {
        setData({...data, apy: event.target.value});
    }
    const handleBorrowChange = (event) => {
        setData({...data, borrowapr: event.target.value});
    }
    const handleLengthChange = (event) => {
        setData({...data, time: event.target.value})
    }
    const handleDebtRatioChange = (event) => {
        setData({...data, liquidationthreshold: event.target.value})
    }



    return (
        <Box>
            <CssBaseline/>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }} variant="permanent" anchor="left">
                <Toolbar>
                    <img
                        src="https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1,format=auto/https%3A%2F%2Ffiles.gitbook.com%2Fv0%2Fb%2Fgitbook-28427.appspot.com%2Fo%2Fspaces%252F-MXI35QzyBtPDqrHT2Z9%252Favatar-1633659029056.png%3Fgeneration%3D1633659029408060%26alt%3Dmedia"/>

                    <Typography variant="h6" noWrap component="div">
                        Farm Frens
                    </Typography>
                </Toolbar>
                <Divider/>
                <List sx={{
                    marginLeft: '15px',
                }}>
                    <ListItem>
                        <Typography>Value of Assets Supplied</Typography>
                    </ListItem>
                    <ListItem>
                        <TextField
                            id="assetprice"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="standard"
                            defaultValue={100}
                            onChange={handleAssetPriceChange}
                        />
                    </ListItem>
                    <ListItem size={'medium'}>
                        <Typography>Leverage Multiplier</Typography>
                    </ListItem>
                    <Box class='tall'>
                        <ListItem>
                            <Slider
                                id={'slider'}
                                aria-label="Always visible"
                                defaultValue={2}
                                step={0.1}
                                marks
                                min={2} max={3}
                                valueLabelDisplay="on"
                                onChange={handleLeverageChange}
                            />
                        </ListItem>
                    </Box>
                    <Divider/>
                    <ListItem>
                        <Typography>
                            Borrowing Interest APR %
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <TextField
                            id="borrowapr"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }} InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                            variant="standard"
                            defaultValue={0}
                            onChange={handleBorrowChange}
                        />
                    </ListItem> <Divider/>
                    <ListItem>
                        <Typography>
                            APR at 1x Leverage
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <TextField
                            id="apy"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }} InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                            variant="standard"
                            defaultValue={0}
                            onChange={handleAPYChange}
                        />
                    </ListItem><Divider/>
                    <ListItem>
                        <Typography>
                            Liquidation Threshold
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <TextField
                            id="debtratio"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }} InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                            variant="standard"
                            defaultValue={85}
                            onChange={handleDebtRatioChange}
                        />
                    </ListItem>
                </List>
                <Divider/>

            </Drawer>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: 'auto',
                    overflow: 'auto',
                }}
            >
                <Toolbar/>
                <Container maxWidth="md" sx={{mt: 4, mb: 4, ml: 4, mr: 4, overflow: 'auto'}}>
                    <Grid container spacing={3}>
                        {/* Chart */}
                        <Grid item xs={12
                        }>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 640,
                                }}>

                                <ShortChart data={data}/>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}} elevation={2}>
                                <Typography> Length of HODL in days </Typography>

                                <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" min={1}
                                        max={365} onChange={handleLengthChange}/>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                                <Paper sx={{ minWidth: 275,p: 2, display: 'flex', flexDirection: 'column' }} elevation={2}>
                                        <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
                                            Shorting an asset through leveraged yield farms
                                        </Typography>
                                    <Typography variant="body2">
                                        By supplying a stable coin and borrowing an asset, you can effectively short it to an extent.
                                    </Typography>
                                    <Typography variant="body2">
                                        When the borrowed asset drops in price, the amount of debt to be repaid also drops. This allows for a bearish position to be taken while also receiving yield rewards.
                                    </Typography>
                                </Paper>
                        </Grid>
                    </Grid>

                </Container>
            </Box>
        </Box>
    );
}

export default ShortAsset;
