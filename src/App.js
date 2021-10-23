import './App.css';
import {useTheme} from "@mui/material/styles";
import Header from "./pages/Header";
import Body from "./pages/Body";
import React from "react";
import {createTheme, CssBaseline} from "@mui/material";
import {ThemeProvider} from "@emotion/react";

function App() {
    const theme = createTheme({
        palette: {
            mode: 'dark',
        },
    });
    return (
        // eslint-disable-next-line react/jsx-no-undef
        <div className="App">
            <header className="App-header">
                <link rel="stylesheet"
                      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                />
            </header>

            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Header/>

                <Body/>

            </ThemeProvider>
        </div>

    );
}

export default App;
