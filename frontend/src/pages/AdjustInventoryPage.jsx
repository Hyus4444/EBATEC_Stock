import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adjustInventoryRequest } from "../api/inventoryMovementsApi";
import { getProductByIdRequest } from "../api/productsApi";

export default function AdjustInventoryPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    tipo_ajuste: "INCREMENTO",
    cantidad: 1,
    justificacion: "",
    observacion: "",
  });
  const [error, setError] = useState("");
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setError("");
        const data = await getProductByIdRequest(id);
        setProduct(data);
      } catch (err) {
        setError(err?.response?.data?.detail || "No se pudo cargar el producto");
      } finally {
        setLoadingProduct(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleChange = (e) => {
    const value =
      e.target.name === "cantidad"
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
      const response = await adjustInventoryRequest({
        producto_id: Number(id),
        tipo_ajuste: form.tipo_ajuste,
        cantidad: form.cantidad,
        justificacion: form.justificacion,
        observacion: form.observacion || null,
      });

      alert(`Ajuste registrado correctamente. Operación: ${response.id_operacion}`);
      navigate(`/inventory/${id}/edit`);
    } catch (err) {
      setError(err?.response?.data?.detail || "Ocurrió un error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return <p>Cargando producto...</p>;
  }

  if (!product) {
    return <p className="error-text">No se encontró el producto.</p>;
  }

  return (
    <div className="form-shell">
      <form onSubmit={handleSubmit}>
        <div className="movement-helper">
          Registre el ajuste unitario para el producto seleccionado
        </div>

        <div className="two-col-form">
          <div>
            <label className="form-label">Producto</label>
            <input
              type="text"
              value={`${product.codigo_interno} - ${product.nombre}`}
              disabled
            />
          </div>

          <div>
            <label className="form-label">Stock actual</label>
            <input
              type="text"
              value={product.stock_actual}
              disabled
            />
          </div>

          <div>
            <label className="form-label">Tipo de ajuste</label>
            <select
              name="tipo_ajuste"
              value={form.tipo_ajuste}
              onChange={handleChange}
              required
            >
              <option value="INCREMENTO">INCREMENTO</option>
              <option value="DECREMENTO">DECREMENTO</option>
            </select>
          </div>

          <div>
            <label className="form-label">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              min="1"
              value={form.cantidad}
              onChange={handleChange}
              required
            />
          </div>

          <div className="full-row">
            <label className="form-label">Justificación</label>
            <textarea
              name="justificacion"
              value={form.justificacion}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div className="full-row">
            <label className="form-label">Observación</label>
            <textarea
              name="observacion"
              value={form.observacion}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="form-actions">
          <button
            className="btn-dark"
            type="button"
            onClick={() => navigate(`/inventory/${id}/edit`)}
          >
            Cancelar
          </button>
          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar ajuste"}
          </button>
        </div>
      </form>
    </div>
  );
}