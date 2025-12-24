import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import BookPage from "../pages/book/BookPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/books", element: <BookPage /> }
        ]
    }
])
