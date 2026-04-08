import { useEffect, useState } from "react";
import { getAuditLogsRequest } from "../api/auditApi";
import { getStockAlertsRequest } from "../api/stockAlertsApi";

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [tab, setTab] = useState("logs");

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [accion, setAccion] = useState("");
  const [query, setQuery] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [total, setTotal] = useState(0);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const loadLogs = async () => {
    try {
      setError("");
      setLoading(true);

      const data = await getAuditLogsRequest({
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
        usuario_id: usuarioId,
        accion,
        page,
        page_size: pageSize,
      });

      setLogs(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err?.response?.data?.detail || "No se pudieron cargar los logs");
    } finally {
      setLoading(false);
    }
  };

  const loadAlerts = async () => {
    try {
      setError("");
      setLoading(true);

      const data = await getStockAlertsRequest(query);
      setAlerts(data);
      setTotal(data.length);
    } catch (err) {
      setError(err?.response?.data?.detail || "No se pudieron cargar las alertas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [fechaDesde, fechaHasta, usuarioId, accion, query, tab]);

  useEffect(() => {
    if (tab === "logs") {
      loadLogs();
    } else {
      loadAlerts();
    }
  }, [tab, fechaDesde, fechaHasta, usuarioId, accion, page, query]);

  return (
    <div>
      <div className="tabs-row">
        <button
          className={tab === "logs" ? "btn-dark active-tab" : "btn-primary"}
          onClick={() => setTab("logs")}
          type="button"
        >
          Logs
        </button>
        <button
          className={tab === "alerts" ? "btn-dark active-tab" : "btn-primary"}
          onClick={() => setTab("alerts")}
          type="button"
        >
          Alertas de stock
        </button>
      </div>

      {tab === "logs" && (
        <div className="audit-filters-grid">
          <div>
            <label className="form-label">Fecha desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Fecha hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Usuario ID</label>
            <input
              type="number"
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
              placeholder="Ej. 1"
            />
          </div>

          <div>
            <label className="form-label">Tipo de operación</label>
            <select value={accion} onChange={(e) => setAccion(e.target.value)}>
              <option value="">Todas</option>
              <option value="CREAR">CREAR</option>
              <option value="ACTUALIZAR">ACTUALIZAR</option>
              <option value="ACTIVAR">ACTIVAR</option>
              <option value="DESACTIVAR">DESACTIVAR</option>
              <option value="ENTRADA">ENTRADA</option>
              <option value="SALIDA">SALIDA</option>
              <option value="AJUSTE_INCREMENTO">AJUSTE_INCREMENTO</option>
              <option value="AJUSTE_DECREMENTO">AJUSTE_DECREMENTO</option>
            </select>
          </div>
        </div>
      )}

      {tab === "alerts" && (
        <div className="inventory-toolbar">
          <input
            className="search-input"
            type="text"
            placeholder="Buscar alertas por código o nombre"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      {loading && <p>Cargando...</p>}
      {error && <p className="error-text">{error}</p>}

      {tab === "logs" && !loading && !error && (
        <>
          <div className="table-wrapper">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>id_auditoria</th>
                  <th>fecha_hora</th>
                  <th>entidad</th>
                  <th>operacion</th>
                  <th>id_usuario</th>
                  <th>detalle</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{new Date(log.fecha).toLocaleString()}</td>
                    <td>{log.entidad}</td>
                    <td>{log.accion}</td>
                    <td>{log.usuario_id}</td>
                    <td>{log.detalle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      {tab === "alerts" && !loading && !error && (
        <div className="table-wrapper">
          <table className="audit-table">
            <thead>
              <tr>
                <th>id_alerta</th>
                <th>codigo</th>
                <th>producto</th>
                <th>stock_actual</th>
                <th>stock_minimo</th>
                <th>actualizada</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.id}</td>
                  <td>{alert.codigo_interno}</td>
                  <td>{alert.nombre}</td>
                  <td>{alert.stock_actual}</td>
                  <td>{alert.stock_minimo}</td>
                  <td>{new Date(alert.updated_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}