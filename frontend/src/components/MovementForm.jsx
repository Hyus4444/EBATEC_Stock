import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProductsForSelectRequest } from "../api/productsApi";

export default function MovementForm({
  title,
  helperText,
  onSubmit,
  submitText,
  allowedReasons,
}) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([
    { producto_id: "", cantidad: 1, motivo: allowedReasons[0] || "" },
  ]);
  const [observacion, setObservacion] = useState("");
  const [error, setError] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  

useEffect(() => {
  const loadProducts = async () => {
    try {
      const data = await getAllProductsForSelectRequest();
      setProducts(data.filter((product) => product.activo));
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const message =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
          ? detail.map((item) => item?.msg || "Error de validación").join(", ")
          : "No se pudieron cargar los productos";

      setError(message);
    } finally {
      setLoadingProducts(false);
    }
  };

  loadProducts();
}, []);

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] =
      field === "producto_id" || field === "cantidad" ? Number(value) : value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { producto_id: "", cantidad: 1, motivo: allowedReasons[0] || "" },
    ]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await onSubmit({
        items,
        observacion: observacion || null,
      });
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const message =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
          ? detail.map((item) => item?.msg || "Error de validación").join(", ")
          : "Ocurrió un error";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProducts) {
    return <p>Cargando productos...</p>;
  }

  return (
    <div className="movement-form-shell">
      <form onSubmit={handleSubmit}>
        <div className="movement-helper">{helperText}</div>

        {items.map((item, index) => (
          <div className="movement-item" key={index}>
            <div>
              <label className="form-label">Producto</label>
              <select
                value={item.producto_id}
                onChange={(e) => updateItem(index, "producto_id", e.target.value)}
                required
              >
                <option value="">Producto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Cantidad</label>
              <input
                type="number"
                min="1"
                value={item.cantidad}
                onChange={(e) => updateItem(index, "cantidad", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Motivo</label>
              <select
                value={item.motivo}
                onChange={(e) => updateItem(index, "motivo", e.target.value)}
                required
              >
                {allowedReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn-dark" type="button" onClick={() => removeItem(index)}>
              -
            </button>
          </div>
        ))}

        <div className="movement-add-row">
          <button className="movement-add-btn" type="button" onClick={addItem}>
            + Añadir campo
          </button>
        </div>

        <div className="full-row">
          <label className="form-label">Observacion</label>
          <textarea
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            rows={3}
          />
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