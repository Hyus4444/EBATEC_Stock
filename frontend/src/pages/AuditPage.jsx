import { useEffect, useState } from "react";
import { getAuditLogsRequest } from "../api/auditApi";

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("logs");

  const loadLogs = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await getAuditLogsRequest();
      setLogs(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "No se pudieron cargar los logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "logs") {
      loadLogs();
    }
  }, [tab]);

  return (
    <div>
      <div className="inventory-toolbar">
        <div className="searchbar-mock">⌕</div>
      </div>

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
        <>
          {loading && <p>Cargando logs...</p>}
          {error && <p className="error-text">{error}</p>}

          {!loading && !error && logs.length > 0 && (
            <div className="table-wrapper">
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>id_auditoria</th>
                    <th>fecha_hora</th>
                    <th>entidad_afectada</th>
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
          )}

          {!loading && !error && logs.length === 0 && (
            <p>No hay registros de auditoría.</p>
          )}
        </>
      )}

      {tab === "alerts" && <p>Vista de alertas pendiente de implementación.</p>}
    </div>
  );
}