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
    <div className="form-shell">
      <form onSubmit={handleSubmit}>
        <div className="two-col-form">
          <div>
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="form-label">{includePassword ? "Contraseña" : "Rol"}</label>
            {includePassword ? (
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            ) : (
              <select name="rol_id" value={form.rol_id} onChange={handleChange} required>
                <option value={1}>ADMINISTRADOR</option>
                <option value={2}>OPERARIO</option>
                <option value={3}>CONSULTA</option>
              </select>
            )}
          </div>

          <div>
            <label className="form-label">Correo electronico</label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </div>

          {includePassword ? (
            <div>
              <label className="form-label">Rol</label>
              <select name="rol_id" value={form.rol_id} onChange={handleChange} required>
                <option value={1}>ADMINISTRADOR</option>
                <option value={2}>OPERARIO</option>
                <option value={3}>CONSULTA</option>
              </select>
            </div>
          ) : null}
        </div>

        {!includePassword && (
          <div style={{ maxWidth: "300px", marginTop: "14px" }}>
            <label className="form-label">Rol</label>
            <select name="rol_id" value={form.rol_id} onChange={handleChange} required>
              <option value={1}>ADMINISTRADOR</option>
              <option value={2}>OPERARIO</option>
              <option value={3}>CONSULTA</option>
            </select>
          </div>
        )}

        {error && <p className="error-text">{error}</p>}

        <div className="form-actions">
          <button className="btn-dark" type="button" onClick={() => navigate("/users")}>
            Cancelar
          </button>
          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : submitText}
          </button>
        </div>
      </form>
    </div>
  );
}