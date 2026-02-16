import {  CircularProgress, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useAppDispatch } from "./store/store";
import { getUser, setUser } from "./features/account/accountSlice";
import { getCart } from "./features/cart/cartSlice";

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        dispatch(setUser(JSON.parse(storedUser)));
        await dispatch(getUser());
        await dispatch(getCart());
      }
      setLoading(false);
    };
    initApp();
  }, [dispatch]);

  if (loading) return <CircularProgress />;

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Outlet />
    </>
  );
}

export default App;

