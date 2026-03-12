import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserForm({
  initialValues,
  onSubmit,
  submitText,
  includePassword = false,
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialValues);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const value =
      e.target.name === "rol_id" ? Number(e.target.value) : e.target.value;

    setForm({
      ...form,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await onSubmit(form);
    } catch (err) {
      setError(err?.response?.data?.detail || "Ocurrió un error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card user-form" onSubmit={handleSubmit}>
      <label>Nombre completo</label>
      <input
        type="text"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        required
      />

      <label>Correo</label>
      <input
        type="email"
        name="correo"
        value={form.correo}
        onChange={handleChange}
        required
      />

      {includePassword && (
        <>
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </>
      )}

      <label>Rol</label>
      <select name="rol_id" value={form.rol_id} onChange={handleChange} required>
        <option value={1}>ADMINISTRADOR</option>
        <option value={2}>OPERARIO</option>
        <option value={3}>CONSULTA</option>
      </select>

      {error && <p className="error-text">{error}</p>}

      <div style={{ display: "flex", gap: "10px" }}>
        <button type="submit" disabled={submitting}>
          {submitting ? "Guardando..." : submitText}
        </button>
        <button type="button" onClick={() => navigate("/users")}>
          Cancelar
        </button>
      </div>
    </form>
  );
}