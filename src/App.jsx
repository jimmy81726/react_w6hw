import { routes } from "./routes/index.jsx";
import { createHashRouter, RouterProvider } from "react-router-dom";

const router = createHashRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />;
    </>
  );
}

export default App;
