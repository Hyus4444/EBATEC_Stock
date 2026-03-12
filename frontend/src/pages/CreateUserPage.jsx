import { useNavigate } from "react-router-dom";
import { createUserRequest } from "../api/usersApi";
import UserForm from "../components/UserForm";

export default function CreateUserPage() {
  const navigate = useNavigate();

  const handleSubmit = async (form) => {
    await createUserRequest({
      nombre: form.nombre,
      correo: form.correo,
      password: form.password,
      rol_id: form.rol_id,
      activo: true,
    });

    alert("Usuario creado correctamente");
    navigate("/users");
  };

  return (
    <UserForm
      initialValues={{
        nombre: "",
        correo: "",
        password: "",
        rol_id: 2,
      }}
      onSubmit={handleSubmit}
      submitText="Guardar usuario"
      includePassword={true}
    />
  );
}