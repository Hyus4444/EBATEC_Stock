import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createUserRequest } from "../api/usersApi";
import { theme } from "../styles/theme";

const ROLE_OPTIONS = [
  { label: "ADMINISTRADOR", value: 1 },
  { label: "OPERARIO", value: 2 },
  { label: "CONSULTA", value: 3 },
];

export default function CreateUserScreen({ navigation }) {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol_id: 1,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const buildReadableError = (err, fallback) => {
    const detail = err?.response?.data?.detail;

    if (typeof detail === "string") return detail;

    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((item) => item?.msg || "Error de validación").join(", ");
    }

    return fallback;
  };

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

      await createUserRequest({
        nombre: form.nombre.trim(),
        correo: form.correo.trim().toLowerCase(),
        password: form.password,
        rol_id: Number(form.rol_id),
      });

      Alert.alert("Éxito", "Usuario creado correctamente");
      navigation.goBack();
    } catch (err) {
      setError(buildReadableError(err, "No se pudo crear el usuario"));
    } finally {
      setSubmitting(false);
    }
  };

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

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={form.password}
            onChangeText={(value) => handleChange("password", value)}
            placeholder="********"
            secureTextEntry
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  buttonText: {
    color: theme.colors.white,
    fontWeight: "700",
  },
});