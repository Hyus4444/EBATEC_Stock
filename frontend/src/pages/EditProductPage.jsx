import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoriesRequest } from "../api/categoriesApi";
import {
  getProductByIdRequest,
  updateProductRequest,
  updateProductStatusRequest,
} from "../api/productsApi";
import ProductForm from "../components/ProductForm";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [statusText, setStatusText] = useState("Desactivar producto");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setError("");
        const [product, categories] = await Promise.all([
          getProductByIdRequest(id),
          getCategoriesRequest(),
        ]);

        const category = categories.find(
          (item) => item.nombre === product.categoria
        );

        setInitialValues({
          codigo_interno: product.codigo_interno,
          nombre: product.nombre,
          descripcion: product.descripcion || "",
          categoria_id: category?.id || "",
          stock_minimo: product.stock_minimo,
        });

        setStatusText(product.activo ? "Desactivar producto" : "Activar producto");
      } catch (err) {
        setError(err?.response?.data?.detail || "No se pudo cargar el producto");
      }
    };

    loadData();
  }, [id]);

  const handleSubmit = async (form) => {
    await updateProductRequest(id, {
      codigo_interno: form.codigo_interno,
      nombre: form.nombre,
      descripcion: form.descripcion || null,
      categoria_id: form.categoria_id,
      stock_minimo: form.stock_minimo,
    });

    alert("Producto actualizado correctamente");
    navigate("/inventory");
  };

  const handleStatusChange = async () => {
    try {
      const currentProduct = await getProductByIdRequest(id);
      const nextStatus = !currentProduct.activo;

      await updateProductStatusRequest(id, { activo: nextStatus });

      alert(nextStatus ? "Producto activado" : "Producto desactivado");
      navigate("/inventory");
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
      <ProductForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitText="Guardar cambios"
      />
      <div className="form-secondary-actions">
        <button
          className="btn-primary"
          type="button"
          onClick={() => navigate(`/inventory/${id}/adjust`)}
        >
          Ajuste unitario
        </button>
      </div>
      <div className="status-box">
        <button className="btn-danger" onClick={handleStatusChange} type="button">
          {statusText}
        </button>
      </div>
    </div>
  );
}