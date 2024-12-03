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
import { Carrierspage } from "./layouts/Carrierspage";
import { CarrierEditpage } from "./layouts/CarrierEditpage";
import { CarrierCreatepage } from "./layouts/CarrierCreatepage";
import { Shipmentspage } from "./layouts/Shipmentspage";
import { ShipmentEditpage } from "./layouts/ShipmentEditpage";
import { ShipmentCreatepage } from "./layouts/ShipmentCreatepage";
import { Warehousespage } from "./layouts/Warehousespage";
import { WarehouseEditpage } from "./layouts/WarehouseEditpage";
import { WarehouseCreatepage } from "./layouts/WarehouseCreatepage";

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
    children: [
      { path: "", element: <Categoriespage /> },
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
    children: [
      { path: "", element: <Orderspage /> },
      //{ path: "edit/:orderId", element: <OrderEditpage /> },
      //{ path: "create", element: <OrderCreatepage /> },
    ],
  },
  {
    path: "/carriers",
    children: [
      { path: "", element: <Carrierspage /> },
      { path: "edit/:carrierId", element: <CarrierEditpage /> },
      { path: "create", element: <CarrierCreatepage /> },
    ],
  },
  {
    path: "/shipments",
    children: [
      { path: "", element: <Shipmentspage /> },
      { path: "edit/:shipmentId", element: <ShipmentEditpage /> },
      { path: "create", element: <ShipmentCreatepage /> },
    ],
  },
  {
    path: "/warehouses",
    children: [
      { path: "", element: <Warehousespage /> },
      { path: "edit/:warehouseId", element: <WarehouseEditpage /> },
      { path: "create", element: <WarehouseCreatepage /> },
    ],
  },
  {
    path: "*",
    element: <NoFoundpage />,
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
