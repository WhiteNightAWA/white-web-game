import React from "react";
import "./styles/App.css";
import {AppBar, createTheme, IconButton, Paper, ThemeProvider, Toolbar, Typography} from "@mui/material";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {ArrowLeft} from "@mui/icons-material";

function App() {
    const [dark, setDark] = React.useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    if (window.localStorage.getItem("dark")) {
        setDark(window.localStorage.getItem("dark") === "true");
    }

    return (
        <ThemeProvider theme={createTheme({palette: {mode: dark ? "dark" : "light"}})}>
            <AppBar position="static" sx={{ height: "4em" }}>
                <Toolbar>
                    {location.pathname !== "/" && <IconButton
                        onClick={() => navigate("/")}
                    ><ArrowLeft/></IconButton>}
                    <Typography variant="h6" component="div">{location.pathname}</Typography>
                </Toolbar>
            </AppBar>
            <Paper sx={{minHeight: "calc(100vh - 4em)"}} elevation={0} square>
                <Outlet/>
            </Paper>
        </ThemeProvider>
    );
}

export default App;
