import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../features/home/HomePage";
import BookPage from "../features/book/BookPage";
import BookDetailPage from "../features/book/BookDetailPage";
import ShoppingCartPage from "../features/cart/ShoppingCartPage";
import LoginPage from "../features/account/LoginPage";
import RegisterPage from "../features/account/RegisterPage";
import CheckoutPage from "../features/checkout/CheckoutPage";
import OrderDetails from "../features/orders/OrderDetails";
import RoleGuard from "./RoleGuard.tsx";
import DashboardPage from "../features/admin/dashboard/DashboardPage.tsx";
import ProductsPage from "../features/admin/product/PoductsPage.tsx";
import AdminLayout from "../components/layout/AdminLayout.tsx";
import PublicLayout from "../components/layout/PublicLayout.tsx";
import AuthorPage from "../features/author/AuthorPage.tsx";
import AuthorDetailPage from "../features/author/AuthorDetailPage.tsx";

export const router = createBrowserRouter([
  {
  path: "/",
  element: <App />,
  children: [

    {
      element: <PublicLayout />,
      children: [

        // PUBLIC
        { index: true, element: <HomePage /> },
        { path: "books", element: <BookPage /> },
        { path: "book/:id", element: <BookDetailPage /> },
        { path: "login", element: <LoginPage /> },
        { path: "register", element: <RegisterPage /> },

        // CUSTOMER (layout içinde olmalı)
        {
          element: <RoleGuard allowedRoles={["Customer"]} />,
          children: [
            { path: "cart", element: <ShoppingCartPage /> },
            { path: "orders", element: <OrderDetails /> },
            { path: "checkout", element: <CheckoutPage /> },
            { path: "authors", element: <AuthorPage/>},
            { path: "author/:id", element: <AuthorDetailPage/>}
          ],
        },
      ],
    },

    // ADMIN ayrı layout
    {
      element: <RoleGuard allowedRoles={["Admin"]} />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            { path: "dashboard", element: <DashboardPage /> },
            { path: "products", element: <ProductsPage /> },
          ],
        },
      ],
    },
  ],
},
]);

