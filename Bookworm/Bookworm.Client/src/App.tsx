import {  Container, CssBaseline } from "@mui/material";
import Navbar from "./components/layout/Navbar";
import { Outlet } from "react-router-dom";

function App() {
    return (
        <>
            <CssBaseline />
            <Navbar />
            <Container>
                <Outlet />
            </Container>
        </>
    );
}

export default App;
