import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import {
  canViewAlerts,
  canViewAudit,
  canViewInventory,
  canViewUsers,
  isAdmin,
  isOperario,
} from "../utils/roleUtils";
import { theme } from "../styles/theme";

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  const canRegisterEntry = isAdmin(user) || isOperario(user);
  const canRegisterExit = isAdmin(user) || isOperario(user);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bienvenido {user?.nombre || ""}</Text>
      <Text style={styles.subtitle}>Rol: {user?.rol || ""}</Text>

      <View style={styles.cardList}>
        {canRegisterEntry && (
          <TouchableOpacity
            style={[styles.card, styles.entryCard]}
            onPress={() => navigation.navigate("Entry")}
          >
            <Text style={styles.cardTitle}>Registrar entrada</Text>
            <Text style={styles.cardText}>Ingreso de productos al inventario</Text>
          </TouchableOpacity>
        )}

        {canRegisterExit && (
          <TouchableOpacity
            style={[styles.card, styles.exitCard]}
            onPress={() => navigation.navigate("Exit", { title: "Registrar salida" })}
          >
            <Text style={styles.cardTitle}>Registrar salida</Text>
            <Text style={styles.cardText}>Salida de productos del inventario</Text>
          </TouchableOpacity>
        )}

        {canViewInventory(user) && (
          <TouchableOpacity
            style={[styles.card, styles.inventoryCard]}
            onPress={() => navigation.navigate("Inventory")}
          >
            <Text style={styles.cardTitle}>Inventario</Text>
            <Text style={styles.cardText}>Consulta y navegación del inventario</Text>
          </TouchableOpacity>
        )}

        {canViewAlerts(user) && (
          <TouchableOpacity
            style={[styles.card, styles.alertsCard]}
            onPress={() => navigation.navigate("Alerts")}
          >
            <Text style={styles.cardTitle}>Alertas</Text>
            <Text style={styles.cardText}>Consulta de stock mínimo</Text>
          </TouchableOpacity>
        )}

        {canViewUsers(user) && (
          <TouchableOpacity
            style={[styles.card, styles.usersCard]}
            onPress={() => navigation.navigate("Users")}
          >
            <Text style={styles.cardTitle}>Usuarios</Text>
            <Text style={styles.cardText}>Módulo placeholder</Text>
          </TouchableOpacity>
        )}

        {canViewAudit(user) && (
          <TouchableOpacity
            style={[styles.card, styles.auditCard]}
            onPress={() => navigation.navigate("Audit")}
          >
            <Text style={styles.cardTitle}>Auditoría</Text>
            <Text style={styles.cardText}>Consulta de logs del sistema</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.panel,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.muted,
    marginBottom: 20,
  },
  cardList: {
    gap: 14,
  },
  card: {
    borderRadius: 14,
    padding: 18,
  },
  entryCard: {
    backgroundColor: "#b8d8f5",
  },
  exitCard: {
    backgroundColor: "#c8d6fa",
  },
  inventoryCard: {
    backgroundColor: "#a6a5d1",
  },
  alertsCard: {
    backgroundColor: "#f6d8a8",
  },
  usersCard: {
    backgroundColor: "#eb979d",
  },
  auditCard: {
    backgroundColor: "#dbe8bc",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  logoutButton: {
    marginTop: 28,
    backgroundColor: theme.colors.dark,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutButtonText: {
    color: theme.colors.white,
    fontWeight: "700",
  },
});