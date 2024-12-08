import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Homepage } from "./layouts/Homepage";
import { Loginpage } from "./layouts/Loginpage";
import { Registerpage } from "./layouts/Registerpage";
import { Catalogpage } from "./layouts/Catalogpage";
import { Cartpage } from "./layouts/Cartpage";
import { Historypage } from "./layouts/Historypage";
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
    path: "/cart",
    element: <Cartpage />,
  },
  {
    path: "/history",
    element: <Historypage />,
  },
  /*{
    path: "/course/:courseId",
    element: <Lessonspage />,
  },*/
  {
    path: "*",
    element: <NoFoundpage />,
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
