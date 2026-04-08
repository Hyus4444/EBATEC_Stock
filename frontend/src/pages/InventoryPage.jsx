import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategoriesRequest } from "../api/categoriesApi";
import { getProductsRequest } from "../api/productsApi";
import { useAuth } from "../context/AuthContext";

export default function InventoryPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.rol === "ADMINISTRADOR";
  const canMoveInventory =
    user?.rol === "ADMINISTRADOR" || user?.rol === "OPERARIO";

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const loadProducts = async () => {
    try {
      setError("");
      setLoading(true);

      const data = await getProductsRequest({
        query,
        categoria_id: categoriaId,
        page,
        page_size: pageSize,
      });

      setProducts(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err?.response?.data?.detail || "No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategoriesRequest();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, categoriaId]);

  useEffect(() => {
    loadProducts();
  }, [query, categoriaId, page]);

  return (
    <div>
      <div className="inventory-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Buscar por código, nombre o descripción"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="category-filter"
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nombre}
            </option>
          ))}
        </select>

        <div className="actions-row">
          {isAdmin && (
            <Link to="/inventory/new">
              <button className="btn-light-icon" type="button">+</button>
              <span className="label" style={{ padding: "8px" }}>
                Nuevo producto
              </span>
            </Link>
          )}

          {canMoveInventory && (
            <>
              <Link to="/inventory/entry">
                <button className="btn-light-icon" type="button">+</button>
                <span className="label" style={{ padding: "8px" }}>
                  Registrar entrada
                </span>
              </Link>

              <Link to="/inventory/exit">
                <button className="btn-light-icon" type="button">−</button>
                <span className="label" style={{ padding: "8px" }}>
                  Registrar salida
                </span>
              </Link>
            </>
          )}
        </div>
      </div>

      {loading && <p>Cargando productos...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p>No se encontraron productos.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <>
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
                  <div className="user-card-actions">
                    <Link to={`/inventory/${product.id}/edit`}>
                      <span className="label" style={{ padding: "5px" }}>
                        Editar
                      </span>
                      <button className="btn-light-icon" type="button">✎</button>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pagination-row">
            <button
              className="btn-dark"
              type="button"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Anterior
            </button>

            <span className="info-text">
              Página {page} de {totalPages}
            </span>

            <button
              className="btn-primary"
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}