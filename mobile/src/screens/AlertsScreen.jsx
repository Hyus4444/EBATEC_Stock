import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getStockAlertsRequest } from "../api/auditApi";
import { theme } from "../styles/theme";

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const buildReadableError = (err, fallback) => {
    const detail = err?.response?.data?.detail;

    if (typeof detail === "string") return detail;

    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((item) => item?.msg || "Error de validación").join(", ");
    }

    return fallback;
  };

  const loadAlerts = async (search = "") => {
    try {
      setError("");
      setLoading(true);

      const data = await getStockAlertsRequest(search);
      setAlerts(data || []);
    } catch (err) {
      setError(buildReadableError(err, "No se pudieron cargar las alertas"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadAlerts(query);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const renderAlertItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.nombre}</Text>
      <Text style={styles.cardText}>Código: {item.codigo_interno}</Text>
      <Text style={styles.cardText}>Producto ID: {item.producto_id}</Text>
      <Text style={styles.cardText}>Stock actual: {item.stock_actual}</Text>
      <Text style={styles.cardText}>Stock mínimo: {item.stock_minimo}</Text>
      <Text style={styles.cardText}>
        Actualizada: {new Date(item.updated_at).toLocaleString()}
      </Text>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>ALERTA ACTIVA</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar por código o nombre"
      />

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderAlertItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.infoText}>No se encontraron alertas activas.</Text>
          }
        />
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
  searchInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    backgroundColor: "#f4f2ee",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
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
  badge: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#f6d8a8",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
});