import { createElement } from "react";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ExpensesPage from "./pages/ExpensesPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

const router = createBrowserRouter([
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
    path: "/sign-in",
    element: createElement(SignInPage),
  },
  {
    path: "/sign-up",
    element: createElement(SignUpPage),
  },
]);

export default router;
