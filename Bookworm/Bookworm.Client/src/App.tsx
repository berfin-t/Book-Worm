import {  CircularProgress, Container, CssBaseline } from "@mui/material";
import Navbar from "./components/layout/Navbar";
import { Outlet } from "react-router-dom";
import { useCartContext } from "./context/CartContext";
import { useEffect, useState } from "react";
import requests from "./api/requests";
import { ToastContainer } from "react-toastify";

function App() {

    const { setCart } = useCartContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        requests.Cart.get()
            .then(cart => setCart(cart))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <CircularProgress />
    
    return (
        <>
            <ToastContainer position="bottom-right" hideProgressBar theme="colored"/>
            <CssBaseline />
            <Navbar />
            <Container>
                <Outlet />
            </Container>
        </>
    );
}

export default App;
