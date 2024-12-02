import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Homepage } from "./layouts/Homepage";
import { NoFoundpage } from "./layouts/NoFoundpage";
import { Loginpage } from "./layouts/Loginpage";
import { Registerpage } from "./layouts/Registerpage";
import { Cartpage } from "./layouts/Cartpage";
import { Historypage } from "./layouts/Historypage";
import { Categoriespage } from "./layouts/Categoriespage";
import { CategoryEditpage } from "./layouts/CategoryEditpage";
import { CategoryCreatepage } from "./layouts/CategoryCreatepage";
import { Productspage } from "./layouts/Productspage";
import { ProductEditpage } from "./layouts/ProductEditpage";
import { ProductCreatepage } from "./layouts/ProductCreatepage";
import { Orderspage } from "./layouts/Orderspage";
//import { OrderEditpage } from "./layouts/OrderEditpage";
//import { OrderCreatepage } from "./layouts/OrderCreatepage";

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
    path: "/products",
    children: [
      { path: "", element: <Productspage /> },
      { path: "edit/:productId", element: <ProductEditpage /> },
      { path: "create", element: <ProductCreatepage /> },
    ],
  },
  {
    path: "/orders",
    element: <Orderspage />,
  },
  /*{
    path: "/order",
    children: [
      { path: "edit/:orderId", element: <OrderEditpage /> },
      { path: "create", element: <OrderCreatepage /> },
    ],
  },*/
  {
    path: "*",
    element: <NoFoundpage />,
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
