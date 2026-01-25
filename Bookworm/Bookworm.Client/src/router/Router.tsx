import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../features/home/HomePage";
import BookPage from "../features/book/BookPage";
import BookDetailPage from "../features/book/BookDetailPage";
import ShoppingCartPage from "../features/cart/ShoppingCartPage";
import LoginPage from "../features/account/LoginPage";
import RegisterPage from "../features/account/RegisterPage";
import CheckoutPage from "../features/checkout/CheckoutPage";
import AuthGuard from "./AuthGuard";
import OrderDetails from "../features/orders/OrderDetails";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { element: <AuthGuard />, children: [
                    {path: "/checkout", element: <CheckoutPage/>},
                    {path: "/orders", element: <OrderDetails/>}
            ] },
            { path: "/", element: <HomePage /> },
            { path: "/books", element: <BookPage /> },
            { path: "/book/:id", element: <BookDetailPage /> },
            { path: "/cart", element: <ShoppingCartPage /> },
            { path: "/login", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> }
        ]
    }
])
