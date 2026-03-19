import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductsRequest } from "../api/productsApi";
import { useAuth } from "../context/AuthContext";

export default function InventoryPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.rol === "ADMINISTRADOR";
  const canMoveInventory =
    user?.rol === "ADMINISTRADOR" || user?.rol === "OPERARIO";

  const loadProducts = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await getProductsRequest();
      setProducts(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
      <div className="inventory-toolbar">
        <div className="searchbar-mock">⌕</div>
        <div className="actions-row">
          {isAdmin && (
            <Link to="/inventory/new">
              <button className="btn-light-icon" type="button">+</button>
              <text className="label" style={{ padding: "8px", contentalign: "center" }}>
                Nuevo producto
              </text> 
            </Link>
          )}

          {canMoveInventory && (
            <>
              <Link to="/inventory/entry">
                <button className="btn-light-icon" type="button">+</button>
                <text className="label" style={{ padding: "8px", contentalign: "center" }}>
                  Registrar entrada
                </text>
              </Link>
              <Link to="/inventory/exit">
                <button className="btn-light-icon" type="button">−</button>
                <text className="label" style={{ padding: "8px", contentalign: "center" }}>
                  Registrar salida
                </text>
              </Link>
            </>
          )}
        </div>
      </div>

      {loading && <p>Cargando productos...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="users-grid">
          {products.map((product) => (
            <div className="user-card" key={product.id}>
              <h3>{product.nombre}</h3>
              <p>Código: {product.codigo_interno}</p>
              <p>Categoría</p>
              <p>{product.categoria}</p>
              <p>Stock: {product.stock_actual}</p>
              <p>Estado: {product.activo ? "Activo" : "Inactivo"}</p>
            
              {isAdmin && (
                <div className="user-card-actions" style={{ position: "sticky", bottom: "0", }}>
                  <Link to={`/inventory/${product.id}/edit`}>
                    <text className="label" style={{ padding: "5px"}}>
                      Editar
                    </text>   
                    <button className="btn-light-icon" type="button">✎</button>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}