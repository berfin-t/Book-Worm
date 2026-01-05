import {  CircularProgress, Container, CssBaseline } from "@mui/material";
import Navbar from "./components/layout/Navbar";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import requests from "./api/requests";
import { ToastContainer } from "react-toastify";
import { useAppDispatch } from "./hooks/hooks";
import { setCart } from "./features/cart/cartSlice";

function App() {

    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        requests.Cart.get()
            .then(cart => dispatch(setCart(cart)))
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
