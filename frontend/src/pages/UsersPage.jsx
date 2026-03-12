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
      <div className="page-header">
        <h1>Usuarios</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={loadUsers}>Recargar</button>
          <Link to="/users/new">
            <button>Nuevo usuario</button>
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
            <p>ID: {user.id}</p>
            <p>Correo: {user.correo}</p>
            <p>Rol: {user.rol}</p>
            <p>Estado: {user.activo ? "Activo" : "Inactivo"}</p>

            <Link to={`/users/${user.id}/edit`}>
              <button>Editar</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}