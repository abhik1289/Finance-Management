import { createElement } from "react";
import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ExpensesPage from "./pages/ExpensesPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";

const router = createBrowserRouter([
  {
    element: createElement(MainLayout),
    children: [
      {
        path: "/",
        element: createElement(HomePage),
      },
      {
        path: "/category",
        element: createElement(CategoryPage),
      },
      {
        path: "/expenses",
        element: createElement(ExpensesPage),
      },
      {
        path: "/profile",
        element: createElement(ProfilePage),
      },
    ],
  },
  {
    element: createElement(AuthLayout),
    children: [
      {
        path: "/sign-in",
        element: createElement(SignInPage),
      },
      {
        path: "/sign-up",
        element: createElement(SignUpPage),
      },
    ],
  },
]);

export default router;
