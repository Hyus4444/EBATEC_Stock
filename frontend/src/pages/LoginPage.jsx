import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoEbatec from "../assets/logo-ebatec-stock.png";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    correo: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.correo, form.password);
      navigate("/home");
    } catch (err) {
      setError(err?.response?.data?.detail || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-page">
      <div className="login-shell">
        <div className="login-grid">
          <div className="login-left">
            <div className="login-logo">
              <img src={logoEbatec} alt="Logo Ebatec-Stock" className="logo-img"/></div>
          </div>
          <div className="login-form-card">
            <h1>Correo</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                placeholder="Value"
                required
              />

              <h1>Contraseña</h1>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Value"
                required
              />

              {error && <p className="error-text">{error}</p>}

              <button className="login-submit-btn" type="submit" disabled={loading}> 
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </button>

              <span className="login-link">¿Olvidó su contraseña?</span>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}