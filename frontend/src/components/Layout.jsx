import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button onClick={() => navigate("/inventory")} className="menu-btn">
          ☰
        </button>

        <div>
          <strong>EBATEC Stock</strong>
        </div>

        <div className="topbar-right">
          <span>{user?.nombre}</span>
          <button onClick={handleLogout}>Salir</button>
        </div>
      </header>

      <nav className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/inventory">Inventario</Link>
        <Link to="/users">Usuarios</Link>
        <Link to="/audit">Auditoría</Link>
      </nav>

      <main className="page-container">
        <Outlet />
      </main>
    </div>
  );
}