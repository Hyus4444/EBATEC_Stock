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
import { createProductRequest, getCategoriesRequest } from "../api/productsApi";
import { theme } from "../styles/theme";

export default function CreateProductScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    codigo_interno: "",
    nombre: "",
    descripcion: "",
    categoria_id: "",
    stock_minimo: "0",
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategoriesRequest();
        setCategories(data);
      } catch (err) {
        setError(err?.response?.data?.detail || "No se pudieron cargar las categorías");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectCategory = (categoryId) => {
    setForm((prev) => ({
      ...prev,
      categoria_id: String(categoryId),
    }));
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setSubmitting(true);

      await createProductRequest({
        codigo_interno: form.codigo_interno.trim(),
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
        categoria_id: Number(form.categoria_id),
        stock_minimo: Number(form.stock_minimo),
        activo: true,
      });

      Alert.alert("Éxito", "Producto creado correctamente");
      navigation.goBack();
    } catch (err) {
      console.log("CREATE PRODUCT ERROR:", err?.response?.data || err?.message);
      setError(err?.response?.data?.detail || "No se pudo crear el producto");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCategories) {
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
          <Text style={styles.label}>Código interno</Text>
          <TextInput
            style={styles.input}
            value={form.codigo_interno}
            onChangeText={(value) => handleChange("codigo_interno", value)}
            placeholder="Ej. MAT-001"
          />

          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={form.nombre}
            onChangeText={(value) => handleChange("nombre", value)}
            placeholder="Nombre del producto"
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.descripcion}
            onChangeText={(value) => handleChange("descripcion", value)}
            placeholder="Descripción"
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Categoría</Text>
          <View style={styles.categoriesRow}>
            {categories.map((category) => {
              const active = String(form.categoria_id) === String(category.id);

              return (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryChip, active && styles.categoryChipActive]}
                  onPress={() => handleSelectCategory(category.id)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      active && styles.categoryChipTextActive,
                    ]}
                  >
                    {category.nombre}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Stock mínimo</Text>
          <TextInput
            style={styles.input}
            value={form.stock_minimo}
            onChangeText={(value) => handleChange("stock_minimo", value)}
            keyboardType="numeric"
            placeholder="0"
          />

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
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  categoryChip: {
    backgroundColor: "#e4dfd8",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.dark,
  },
  categoryChipText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
  categoryChipTextActive: {
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