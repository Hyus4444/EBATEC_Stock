import { useNavigate } from "react-router-dom";
import { createProductRequest } from "../api/productsApi";
import ProductForm from "../components/ProductForm";

export default function CreateProductPage() {
  const navigate = useNavigate();

  const handleSubmit = async (form) => {
    await createProductRequest({
      codigo_interno: form.codigo_interno,
      nombre: form.nombre,
      descripcion: form.descripcion || null,
      categoria_id: form.categoria_id,
      stock_minimo: form.stock_minimo,
      activo: true,
    });

    alert("Producto creado correctamente");
    navigate("/inventory");
  };

  return (
    <ProductForm
      initialValues={{
        codigo_interno: "",
        nombre: "",
        descripcion: "",
        categoria_id: "",
        stock_minimo: 0,
      }}
      onSubmit={handleSubmit}
      submitText="Guardar producto"
    />
  );
}