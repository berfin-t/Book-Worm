import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import BookPage from "../pages/book/BookPage";
import BookDetailPage from "../pages/book/BookDetailPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/books", element: <BookPage /> },
            { path: "/book/:id", element: <BookDetailPage /> } 
        ]
    }
])
