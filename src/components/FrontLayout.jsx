import { NavLink, Outlet } from "react-router-dom";

const routes = [
  {
    name: "首頁",
    path: "/",
  },
  {
    name: "產品頁面",
    path: "/product",
  },
  {
    name: "購物車",
    path: "/carts",
  },
];
const FrontLayout = () => {
  return (
    <>
      <nav
        className="navbar bg-dark border-bottom border-body"
        data-bs-theme="dark"
      >
        <div className="container">
          <ul className="navbar-nav flex-row gap-5 fs-5">
            {routes.map((route) => (
              <li className="nav-item" key={route.name}>
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to={route.path}
                >
                  {route.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="container">
        <Outlet />
      </div>
    </>
  );
};

export default FrontLayout;
