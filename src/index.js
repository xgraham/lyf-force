import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import reportWebVitals from './reportWebVitals';
import Body from "./pages/Body";
import Header from "./pages/Header";
import App from "./App";
import {useTheme} from "@mui/material/styles";
import {ThemeProvider} from "@emotion/react";
import {createTheme, CssBaseline} from "@mui/material";

const theme = createTheme({
    palette: {
        type: "dark",
    }
});

ReactDOM.render(
    <React.StrictMode>

        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <App/>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
