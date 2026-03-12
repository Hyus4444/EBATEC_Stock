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
    <div className="card">
      <div className="page-header">
        <h1>Auditoría</h1>
        <button onClick={loadLogs}>Recargar</button>
      </div>

      <div className="tabs-row">
        <button
          className={tab === "logs" ? "active-tab" : ""}
          onClick={() => setTab("logs")}
        >
          Logs
        </button>
        <button
          className={tab === "alerts" ? "active-tab" : ""}
          onClick={() => setTab("alerts")}
        >
          Alertas de stock
        </button>
      </div>

      {tab === "logs" && (
        <>
          {loading && <p>Cargando logs...</p>}
          {error && <p className="error-text">{error}</p>}

          {!loading && !error && logs.length === 0 && (
            <p>No hay registros de auditoría.</p>
          )}

          {!loading && !error && logs.length > 0 && (
            <div className="table-wrapper">
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Acción</th>
                    <th>Entidad</th>
                    <th>ID entidad</th>
                    <th>Detalle</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.id}</td>
                      <td>{log.usuario_id}</td>
                      <td>{log.accion}</td>
                      <td>{log.entidad}</td>
                      <td>{log.entidad_id}</td>
                      <td>{log.detalle}</td>
                      <td>{new Date(log.fecha).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === "alerts" && (
        <div>
          <p>Vista de alertas de stock pendiente de implementación.</p>
        </div>
      )}
    </div>
  );
}