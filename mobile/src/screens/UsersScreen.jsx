import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getUsersRequest } from "../api/usersApi";
import { theme } from "../styles/theme";

export default function UsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);
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

  const loadUsers = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await getUsersRequest();
      setUsers(data || []);
    } catch (err) {
      setError(buildReadableError(err, "No se pudieron cargar los usuarios"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadUsers();
    });

    return unsubscribe;
  }, [navigation]);

  const renderUserItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.nombre}</Text>
      <Text style={styles.cardText}>Correo: {item.correo}</Text>
      <Text style={styles.cardText}>Rol: {item.rol}</Text>
      <Text style={styles.cardText}>
        Estado: {item.activo ? "Activo" : "Inactivo"}
      </Text>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditUser", { id: item.id })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topActions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={loadUsers}
        >
          <Text style={styles.buttonText}>Recargar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("CreateUser")}
        >
          <Text style={styles.buttonText}>Nuevo usuario</Text>
        </TouchableOpacity>
      </View>

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
          data={users}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderUserItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.infoText}>No hay usuarios registrados.</Text>
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
  topActions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
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
  buttonText: {
    color: theme.colors.white,
    fontWeight: "700",
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
  cardActions: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  editButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});