import FrontLayout from "../components/FrontLayout";
import Home from "../pages/Home";
import Carts from "../pages/Carts";
import ProductDetail from "../pages/Productdetail";
import ProductList from "../pages/Productlist";
import NotFound from "../pages/NotFound";

export const routes = [
  {
    path: "/",
    element: <FrontLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "carts",
        element: <Carts />,
      },
      {
        path: "product/:id",
        element: <ProductDetail />,
      },
      {
        path: "product",
        element: <ProductList />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];
