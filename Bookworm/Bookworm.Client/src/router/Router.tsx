import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../features/HomePage";
import BookPage from "../features/book/BookPage";
import BookDetailPage from "../features/book/BookDetailPage";
import ShoppingCartPage from "../features/cart/ShoppingCartPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/books", element: <BookPage /> },
            { path: "/book/:id", element: <BookDetailPage /> },
            { path: "/cart", element: <ShoppingCartPage /> }
        ]
    }
])
