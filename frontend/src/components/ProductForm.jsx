import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategoriesRequest } from "../api/categoriesApi";

export default function ProductForm({
  initialValues,
  onSubmit,
  submitText,
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialValues);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategoriesRequest();
        setCategories(data);
      } catch (err) {
        setError(err?.response?.data?.detail || "No se pudieron cargar las categorías");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (e) => {
    const value =
      e.target.name === "categoria_id" || e.target.name === "stock_minimo"
        ? Number(e.target.value)
        : e.target.value;

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

  if (loadingCategories) {
    return <p>Cargando categorías...</p>;
  }

  return (
    <div className="form-shell">
      <form onSubmit={handleSubmit}>
        <div className="two-col-form">
          <div>
            <label className="form-label">Codigo interno</label>
            <input
              type="text"
              name="codigo_interno"
              value={form.codigo_interno}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="form-label">Categoria</label>
            <select
              name="categoria_id"
              value={form.categoria_id}
              onChange={handleChange}
              required
            >
              <option value="">Value</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nombre}
                </option>
              ))}
            </select>
          </div>

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
            <label className="form-label">Stock minimo</label>
            <input
              type="number"
              name="stock_minimo"
              value={form.stock_minimo}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="full-row" style={{ maxWidth: "340px" }}>
            <label className="form-label">Descripcion</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={5}
            />
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="form-actions">
          <button className="btn-dark" type="button" onClick={() => navigate("/inventory")}>
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