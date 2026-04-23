import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoEbatec from "../assets/logo-ebatec-stock.png";

const titles = {
  "/home": "Inicio",
  "/inventory": "Inventario",
  "/users": "Usuarios",
  "/audit": "Auditoría",
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getTitle = () => {
    if (location.pathname.startsWith("/inventory/new")) return "Crear nuevo producto";
    if (location.pathname.startsWith("/inventory/entry")) return "Registrar Entrada";
    if (location.pathname.startsWith("/inventory/exit")) return "Registrar Salida";
    if (location.pathname.startsWith("/inventory/") && location.pathname.endsWith("/adjust")) {
      return "Ajuste de inventario";
    }

    if (location.pathname.startsWith("/inventory/") && location.pathname.endsWith("/edit")) {
      return "Modificar producto";  
    }

    if (location.pathname.startsWith("/users/new")) return "Creación de nuevo usuario";
    if (location.pathname.startsWith("/users/") && location.pathname.endsWith("/edit")) {
      return "Modificar usuario";
    }


    return titles[location.pathname] || "EBATEC Stock";
  };

  return (
    <div className="app-shell">
      <div className="page-container">
        <header className="view-header">
          <div className="view-header-left">
            <button
              className="inventory-icon-btn"
              onClick={() => navigate("/inventory")}
              type="button"
              title="Ir a inventario"
            >
              ☰
            </button>

            <h1 className="view-title">{getTitle()}</h1>
          </div>

          <button
            className="header-logo-btn"
            type="button"
            onClick={() => navigate("/home")}
            title="Ir al inicio"
          >
            <img src={logoEbatec} alt="Logo Ebatec" className="header-logo-img" width="250" />
          </button>
        </header>

        <div className="page-body">
          <Outlet />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 28px 24px" }}>
          <button className="btn-dark" onClick={handleLogout} type="button">
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}