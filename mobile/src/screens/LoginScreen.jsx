import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { theme } from "../styles/theme";

export default function LoginScreen() {
  const { login } = useAuth();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  try {
    setError("");
    setLoading(true);
    if (!correo.trim() || !password.trim()) {
      setError("Por favor, ingresa correo y contraseña");
      return;
    }
    const cleanCorreo = correo.trim().toLowerCase();
    const cleanPassword = password.trim();
    await login(cleanCorreo, cleanPassword);
  } catch (err) {
    setError(err?.response?.data?.detail || err?.message || "Error al iniciar sesión");
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.panel}>
          <View style={styles.leftSection}>
              <Image source={require("C:/Users/Jairo/Documents/Repositorios/Proyecto de autogestion/EBATEC Stock/mobile/assets/logo.png")} style={{width: 400, height: 200}} />
          </View>

          <View style={styles.rightSection}>
            <Text style={styles.label}>Correo</Text>
            <TextInput
              style={styles.input}
              value={correo}
              onChangeText={setCorreo}
              placeholder="correo@ejemplo.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="********"
              secureTextEntry
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <Text style={styles.loginButtonText}>Iniciar sesión</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.panel,
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: theme.colors.panel,
  },
  panel: {
    backgroundColor: theme.colors.panel,
    borderRadius: 18,
    padding: 24,
    gap: 24,
  },
  leftSection: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logo: {
    fontSize: 34,
    fontWeight: "800",
    color: "#2a2e86",
  },
  logoRed: {
    color: "#f13f32",
  },
  welcome: {
    marginTop: 12,
    fontSize: 24,
    textAlign: "center",
    color: theme.colors.text,
  },
  rightSection: {
    backgroundColor: "#f7f6f4",
    borderRadius: 12,
    padding: 18,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: theme.colors.text,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    backgroundColor: "#f4f2ee",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  error: {
    color: "#c62828",
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  loginButtonText: {
    color: theme.colors.white,
    fontWeight: "700",
  },
});