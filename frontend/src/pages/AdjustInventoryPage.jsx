import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adjustInventoryRequest } from "../api/inventoryMovementsApi";
import { getProductsRequest } from "../api/productsApi";

export default function AdjustInventoryPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    producto_id: "",
    tipo_ajuste: "INCREMENTO",
    cantidad: 1,
    justificacion: "",
    observacion: "",
  });
  const [error, setError] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProductsRequest();
        setProducts(data.filter((product) => product.activo));
      } catch (err) {
        setError(err?.response?.data?.detail || "No se pudieron cargar los productos");
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const handleChange = (e) => {
    const value =
      e.target.name === "producto_id" || e.target.name === "cantidad"
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
        producto_id: form.producto_id,
        tipo_ajuste: form.tipo_ajuste,
        cantidad: form.cantidad,
        justificacion: form.justificacion,
        observacion: form.observacion || null,
      });

      alert(`Ajuste registrado correctamente. Operación: ${response.id_operacion}`);
      navigate("/inventory");
    } catch (err) {
      setError(err?.response?.data?.detail || "Ocurrió un error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProducts) {
    return <p>Cargando productos...</p>;
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h1>Ajuste de inventario</h1>

      <label>Producto</label>
      <select
        name="producto_id"
        value={form.producto_id}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione un producto</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.codigo_interno} - {product.nombre}
          </option>
        ))}
      </select>

      <label>Tipo de ajuste</label>
      <select
        name="tipo_ajuste"
        value={form.tipo_ajuste}
        onChange={handleChange}
        required
      >
        <option value="INCREMENTO">INCREMENTO</option>
        <option value="DECREMENTO">DECREMENTO</option>
      </select>

      <label>Cantidad</label>
      <input
        type="number"
        name="cantidad"
        min="1"
        value={form.cantidad}
        onChange={handleChange}
        required
      />

      <label>Justificación</label>
      <textarea
        name="justificacion"
        value={form.justificacion}
        onChange={handleChange}
        rows={3}
        required
      />

      <label>Observación</label>
      <textarea
        name="observacion"
        value={form.observacion}
        onChange={handleChange}
        rows={3}
      />

      {error && <p className="error-text">{error}</p>}

      <div style={{ display: "flex", gap: "10px" }}>
        <button type="submit" disabled={submitting}>
          {submitting ? "Guardando..." : "Guardar ajuste"}
        </button>
        <button type="button" onClick={() => navigate("/inventory")}>
          Cancelar
        </button>
      </div>
    </form>
  );
}