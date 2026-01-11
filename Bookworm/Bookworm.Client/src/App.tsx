import {  CircularProgress, Container, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useAppDispatch } from "./store/store";
import { getUser } from "./features/account/accountSlice";
import { getCart } from "./features/cart/cartSlice";
import Navbar from "./components/layout/Navbar";

function App() {

    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    const initApp = async () => {
        await dispatch(getCart());
        await dispatch(getUser());
    }

    useEffect(() => {
        initApp().then(() => setLoading(false));
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
