import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Homepage } from "./layouts/Homepage";
import { Loginpage } from "./layouts/Loginpage";
import { Registerpage } from "./layouts/Registerpage";
import { Catalogpage } from "./layouts/Catalogpage";
import { ItemEditpage } from "./layouts/ItemEditpage";
import { ItemCreatepage } from "./layouts/ItemCreatepage";
import { Cartpage } from "./layouts/Cartpage";
import { Historypage } from "./layouts/Historypage";
import { Categoriespage } from "./layouts/Categoriespage";
import { CategoryEditpage } from "./layouts/CategoryEditpage";
import { CategoryCreatepage } from "./layouts/CategoryCreatepage";
import { NoFoundpage } from "./layouts/NoFoundpage";

const router = createBrowserRouter([
  {
    path: "",
    element: <Homepage />,
  },
  {
    path: "/auth",
    children: [
      { path: "", element: <NoFoundpage /> },
      { path: "login", element: <Loginpage /> },
      { path: "register", element: <Registerpage /> },
    ],
  },
  {
    path: "/catalog",
    element: <Catalogpage />,
  },
  {
    path: "/item",
    children: [
      { path: "edit/:itemId", element: <ItemEditpage /> },
      { path: "create", element: <ItemCreatepage /> },
    ],
  },
  {
    path: "/cart",
    element: <Cartpage />,
  },
  {
    path: "/history",
    element: <Historypage />,
  },
  {
    path: "/categories",
    element: <Categoriespage />,
  },
  {
    path: "/category",
    children: [
      { path: "edit/:categoryId", element: <CategoryEditpage /> },
      { path: "create", element: <CategoryCreatepage /> },
    ],
  },
  {
    path: "*",
    element: <NoFoundpage />,
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
