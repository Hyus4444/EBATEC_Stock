import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <div className="home-grid">
        <h1 className="home-welcome">Bienvenido {user?.nombre || ""}</h1>
        <button
          type="button"
          className="home-module-card module-inventory"
          onClick={() => navigate("/inventory")}
        >
          <div style={{ textAlign: "left" }}>
            <h2>Inventario</h2>
            <p>Gestión de productos</p>
          </div>
          <div className="module-icon">📋</div>
        </button>

        {user?.rol === "ADMINISTRADOR" && (
          <button
            type="button"
            className="home-module-card module-users"
            onClick={() => navigate("/users")}
          >
            <div style={{ textAlign: "left" }}>
              <h2>Usuarios</h2>
              <p>Gestión de usuarios del sistema</p>
            </div>
            <div className="module-icon">⚙️</div>
          </button>
        )}

        {user?.rol === "ADMINISTRADOR" && (
          <button
            type="button"
            className="home-module-card module-audit"
            onClick={() => navigate("/audit")}
          >
            <div style={{ textAlign: "left" }}>
              <h2>Auditoría</h2>
              <p>Gestión de registros del sistema</p>
            </div>
            <div className="module-icon">🔎</div>
          </button>
        )}
      </div>
    </div>
  );
}