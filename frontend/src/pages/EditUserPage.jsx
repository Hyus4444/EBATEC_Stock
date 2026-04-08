import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getUserByIdRequest,
  updateUserRequest,
  updateUserStatusRequest,
} from "../api/usersApi";
import UserForm from "../components/UserForm";

const roleMap = {
  ADMINISTRADOR: 1,
  OPERARIO: 2,
  CONSULTA: 3,
};

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [statusText, setStatusText] = useState("Desactivar usuario");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        setError("");
        const user = await getUserByIdRequest(id);

        setInitialValues({
          nombre: user.nombre,
          correo: user.correo,
          rol_id: roleMap[user.rol],
        });

        setStatusText(user.activo ? "Desactivar usuario" : "Activar usuario");
      } catch (err) {
        setError(err?.response?.data?.detail || "No se pudo cargar el usuario");
      }
    };

    loadUser();
  }, [id]);

  const handleSubmit = async (form) => {
    await updateUserRequest(id, form);
    alert("Usuario actualizado correctamente");
    navigate("/users");
  };

  const handleStatusChange = async () => {
    try {
      const currentUser = await getUserByIdRequest(id);
      const nextStatus = !currentUser.activo;

      await updateUserStatusRequest(id, { activo: nextStatus });

      alert(nextStatus ? "Usuario activado" : "Usuario desactivado");
      navigate("/users");
    } catch (err) {
      setError(err?.response?.data?.detail || "No se pudo cambiar el estado");
    }
  };

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (!initialValues) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <UserForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitText="Guardar cambios"
      />

      <div className="status-box">
        <button className="btn-danger" onClick={handleStatusChange}>
          {statusText}
        </button>
      </div>
    </div>
  );
}