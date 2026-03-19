import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsersRequest } from "../api/usersApi";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await getUsersRequest();
      setUsers(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="card">
      <div className="inventory-toolbar users-toolbar-right">
        <div className="actions-row actions-column-like-mockup">
          <div className="floating-action-group">
            <button className="btn-light-icon" onClick={loadUsers} type="button">
              ↻
            </button>
            <span className="floating-action-label">Recargar</span>
          </div>

          <Link to="/users/new" className="floating-action-link">
            <div className="floating-action-group">
              <button className="btn-light-icon" type="button">
                +
              </button>
              <span className="floating-action-label">Añadir nuevo usuario</span>
            </div>
          </Link>
        </div>
      </div>

      {loading && <p>Cargando usuarios...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && users.length === 0 && (
        <p>No hay usuarios registrados.</p>
      )}

      <div className="users-grid">
        {users.map((user) => (
          <div className="user-card" key={user.id}>
            <h3>{user.nombre}</h3>
            <p>Id del usuario</p>
            <p>{user.id}</p>
            <p>Rol</p>
            <p>{user.rol}</p>
            <p>Estado: {user.activo ? "Activo" : "Inactivo"}</p>
            
            <div className="user-card-actions">
              <Link to={`/users/${user.id}/edit`}>
                <button className="btn-light-icon" type="button">
                  ✎
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}