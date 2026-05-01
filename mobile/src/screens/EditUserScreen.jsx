import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getUserByIdRequest,
  updateUserRequest,
  updateUserStatusRequest,
} from "../api/usersApi";
import { theme } from "../styles/theme";

const ROLE_OPTIONS = [
  { label: "ADMINISTRADOR", value: 1 },
  { label: "OPERARIO", value: 2 },
  { label: "CONSULTA", value: 3 },
];

const ROLE_NAME_TO_ID = {
  ADMINISTRADOR: 1,
  OPERARIO: 2,
  CONSULTA: 3,
};

export default function EditUserScreen({ route, navigation }) {
  const { id } = route.params;

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    rol_id: 1,
  });
  const [activo, setActivo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState("");

  const buildReadableError = (err, fallback) => {
    const detail = err?.response?.data?.detail;

    if (typeof detail === "string") return detail;

    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((item) => item?.msg || "Error de validación").join(", ");
    }

    return fallback;
  };

  const loadUser = async () => {
    try {
      setError("");
      setLoading(true);

      const data = await getUserByIdRequest(id);

      setForm({
        nombre: data.nombre || "",
        correo: data.correo || "",
        rol_id: ROLE_NAME_TO_ID[data.rol] || 1,
      });

      setActivo(!!data.activo);
    } catch (err) {
      setError(buildReadableError(err, "No se pudo cargar el usuario"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setSubmitting(true);

      await updateUserRequest(id, {
        nombre: form.nombre.trim(),
        correo: form.correo.trim().toLowerCase(),
        rol_id: Number(form.rol_id),
      });

      Alert.alert("Éxito", "Usuario actualizado correctamente");
      navigation.goBack();
    } catch (err) {
      setError(buildReadableError(err, "No se pudo actualizar el usuario"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      setError("");
      setStatusLoading(true);

      await updateUserStatusRequest(id, {
        activo: !activo,
      });

      Alert.alert("Éxito", !activo ? "Usuario activado" : "Usuario desactivado");
      navigation.goBack();
    } catch (err) {
      setError(buildReadableError(err, "No se pudo cambiar el estado"));
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={form.nombre}
            onChangeText={(value) => handleChange("nombre", value)}
            placeholder="Nombre completo"
          />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={form.correo}
            onChangeText={(value) => handleChange("correo", value)}
            placeholder="correo@ejemplo.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Rol</Text>
          <View style={styles.roleWrap}>
            {ROLE_OPTIONS.map((role) => {
              const active = Number(form.rol_id) === Number(role.value);

              return (
                <TouchableOpacity
                  key={role.value}
                  style={[styles.roleChip, active && styles.roleChipActive]}
                  onPress={() => handleChange("rol_id", role.value)}
                >
                  <Text
                    style={[
                      styles.roleChipText,
                      active && styles.roleChipTextActive,
                    ]}
                  >
                    {role.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.statusText}>
            Estado actual: {activo ? "Activo" : "Inactivo"}
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.buttonText}>
                {submitting ? "Guardando..." : "Guardar"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.statusButton}
            onPress={handleStatusChange}
            disabled={statusLoading}
          >
            <Text style={styles.buttonText}>
              {statusLoading
                ? "Procesando..."
                : activo
                ? "Desactivar usuario"
                : "Activar usuario"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.panel,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.panel,
  },
  scrollContent: {
    padding: 16,
  },
  formCard: {
    backgroundColor: "#f7f6f4",
    borderRadius: 14,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    backgroundColor: "#f4f2ee",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  roleWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  roleChip: {
    backgroundColor: "#e4dfd8",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  roleChipActive: {
    backgroundColor: theme.colors.dark,
  },
  roleChipText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
  roleChipTextActive: {
    color: theme.colors.white,
  },
  statusText: {
    marginTop: 14,
    color: theme.colors.text,
    fontWeight: "600",
  },
  errorText: {
    color: "#c62828",
    marginTop: 14,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.dark,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  statusButton: {
    marginTop: 14,
    backgroundColor: theme.colors.danger,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: "700",
  },
});