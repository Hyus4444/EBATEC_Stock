import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getAuditLogsRequest } from "../api/auditApi";
import { theme } from "../styles/theme";

const ACTION_OPTIONS = [
  { label: "Todas", value: "" },
  { label: "CREAR", value: "CREAR" },
  { label: "ACTUALIZAR", value: "ACTUALIZAR" },
  { label: "ACTIVAR", value: "ACTIVAR" },
  { label: "DESACTIVAR", value: "DESACTIVAR" },
  { label: "ENTRADA", value: "ENTRADA" },
  { label: "SALIDA", value: "SALIDA" },
  { label: "AJUSTE +", value: "AJUSTE_INCREMENTO" },
  { label: "AJUSTE -", value: "AJUSTE_DECREMENTO" },
];

export default function AuditScreen() {
  const [logs, setLogs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [accion, setAccion] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const buildReadableError = (err, fallback) => {
    const detail = err?.response?.data?.detail;

    if (typeof detail === "string") return detail;

    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((item) => item?.msg || "Error de validación").join(", ");
    }

    return fallback;
  };

  const loadLogs = async (targetPage = page) => {
    try {
      setError("");
      setLoading(true);

      const data = await getAuditLogsRequest({
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
        usuario_id: usuarioId,
        accion,
        page: targetPage,
        page_size: pageSize,
      });

      setLogs(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(buildReadableError(err, "No se pudieron cargar los logs"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs(page);
  }, [page]);

  const applyFilters = () => {
    if (page !== 1) {
      setPage(1);
    } else {
      loadLogs(1);
    }
  };

  const clearFilters = () => {
    setFechaDesde("");
    setFechaHasta("");
    setUsuarioId("");
    setAccion("");

    if (page !== 1) {
      setPage(1);
    } else {
      loadLogs(1);
    }
  };

  const renderLogItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.accion}</Text>
      <Text style={styles.cardText}>Entidad: {item.entidad}</Text>
      <Text style={styles.cardText}>Usuario ID: {item.usuario_id}</Text>
      <Text style={styles.cardText}>Entidad ID: {item.entidad_id}</Text>
      <Text style={styles.cardText}>
        Fecha: {new Date(item.fecha).toLocaleString()}
      </Text>
      <Text style={styles.cardDetail}>{item.detalle || "Sin detalle"}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topActions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setShowFilters((prev) => !prev)}
        >
          <Text style={styles.buttonText}>
            {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={clearFilters}>
          <Text style={styles.buttonText}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersPanel}>
          <Text style={styles.label}>Fecha desde</Text>
          <TextInput
            style={styles.input}
            value={fechaDesde}
            onChangeText={setFechaDesde}
            placeholder="YYYY-MM-DD"
          />

          <Text style={styles.label}>Fecha hasta</Text>
          <TextInput
            style={styles.input}
            value={fechaHasta}
            onChangeText={setFechaHasta}
            placeholder="YYYY-MM-DD"
          />

          <Text style={styles.label}>Usuario ID</Text>
          <TextInput
            style={styles.input}
            value={usuarioId}
            onChangeText={setUsuarioId}
            placeholder="Ej. 1"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Tipo de operación</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={accion}
              onValueChange={(value) => setAccion(value)}
            >
              {ACTION_OPTIONS.map((option) => (
                <Picker.Item
                  key={option.value || "ALL"}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>

          <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
            <Text style={styles.buttonText}>Aplicar filtros</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={logs}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderLogItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.infoText}>No se encontraron logs.</Text>
            }
          />

          <View style={styles.paginationRow}>
            <TouchableOpacity
              style={[
                styles.secondaryButtonSmall,
                page === 1 && styles.paginationButtonDisabled,
              ]}
              disabled={page === 1}
              onPress={() => setPage((prev) => prev - 1)}
            >
              <Text style={styles.buttonText}>Anterior</Text>
            </TouchableOpacity>

            <Text style={styles.pageText}>
              Página {page} de {totalPages}
            </Text>

            <TouchableOpacity
              style={[
                styles.primaryButtonSmall,
                page >= totalPages && styles.paginationButtonDisabled,
              ]}
              disabled={page >= totalPages}
              onPress={() => setPage((prev) => prev + 1)}
            >
              <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.panel,
    padding: 16,
  },
  topActions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  filtersPanel: {
    backgroundColor: "#f7f6f4",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    backgroundColor: "#f4f2ee",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    backgroundColor: "#f4f2ee",
    overflow: "hidden",
  },
  applyButton: {
    marginTop: 14,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: theme.colors.dark,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonSmall: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  secondaryButtonSmall: {
    backgroundColor: theme.colors.dark,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: 13,
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#c62828",
    textAlign: "center",
  },
  infoText: {
    textAlign: "center",
    color: theme.colors.muted,
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#f7f6f4",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 4,
  },
  cardDetail: {
    marginTop: 8,
    fontSize: 13,
    color: theme.colors.muted,
  },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  paginationButtonDisabled: {
    opacity: 0.4,
  },
  pageText: {
    flex: 1,
    textAlign: "center",
    color: theme.colors.text,
    fontWeight: "600",
  },
});