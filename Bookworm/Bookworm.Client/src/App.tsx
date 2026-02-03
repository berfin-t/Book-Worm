import {  CircularProgress, Container, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "./store/store";
import { getUser } from "./features/account/accountSlice";
import { getCart } from "./features/cart/cartSlice";
import AdminLayout from "./components/layout/AdminLayout";
import UserLayout from "./components/layout/UserLayout";

function App() {

    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    const { user } = useAppSelector(state => state.account);

    const isAdmin = user?.roles?.includes("Admin");

    useEffect(() => {
        const initApp = async () => {
            await dispatch(getUser());   
            await dispatch(getCart());   
            setLoading(false);
        };

        initApp();
    }, [dispatch]);

    if (loading) return <CircularProgress />
    
    return (
        <>
            <ToastContainer position="bottom-right" hideProgressBar theme="colored"/>
            <CssBaseline />
            {isAdmin ? <AdminLayout /> : <UserLayout />}
            <Container>
                <Outlet />
            </Container>
        </>
    );
}

export default App;
