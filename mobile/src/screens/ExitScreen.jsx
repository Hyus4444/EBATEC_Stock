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
import { Picker } from "@react-native-picker/picker";
import { registerExitRequest } from "../api/inventoryMovementsApi";
import { getAllProductsForSelectRequest } from "../api/productsApi";
import { theme } from "../styles/theme";

const EXIT_REASONS = ["DESPACHO", "CONSUMO"];

export default function ExitScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([
    { producto_id: "", cantidad: "1", motivo: EXIT_REASONS[0] },
  ]);
  const [observacion, setObservacion] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProductsForSelectRequest();
        setProducts(data.filter((product) => product.activo));
      } catch (err) {
        const detail = err?.response?.data?.detail;
        const message =
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
            ? detail.map((item) => item?.msg || "Error de validación").join(", ")
            : "No se pudieron cargar los productos";

        setError(message);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const updateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { producto_id: "", cantidad: "1", motivo: EXIT_REASONS[0] },
    ]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const buildReadableError = (err, fallback) => {
    const detail = err?.response?.data?.detail;

    if (typeof detail === "string") return detail;

    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((item) => item?.msg || "Error de validación").join(", ");
    }

    return fallback;
  };

  const validateItems = () => {
    for (const item of items) {
      if (!item.producto_id) {
        return "Debes seleccionar un producto en todos los ítems";
      }

      if (!item.cantidad || Number(item.cantidad) <= 0) {
        return "La cantidad debe ser mayor que cero en todos los ítems";
      }

      if (!item.motivo) {
        return "Debes seleccionar un motivo en todos los ítems";
      }
    }

    return "";
  };

  const handleSubmit = async () => {
    try {
      setError("");

      const validationError = validateItems();
      if (validationError) {
        setError(validationError);
        return;
      }

      setSubmitting(true);

      const payload = {
        items: items.map((item) => ({
          producto_id: Number(item.producto_id),
          cantidad: Number(item.cantidad),
          motivo: item.motivo,
        })),
        observacion: observacion.trim() || null,
      };

      const response = await registerExitRequest(payload);

      Alert.alert(
        "Éxito",
        `Salida registrada correctamente.\nOperación: ${response.id_operacion}`
      );

      navigation.goBack();
    } catch (err) {
      setError(buildReadableError(err, "No se pudo registrar la salida"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProducts) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.helperText}>
          Registre una salida agregando uno o varios productos.
        </Text>

        {items.map((item, index) => (
          <View key={index} style={styles.itemCard}>
            <Text style={styles.label}>Producto</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={item.producto_id}
                onValueChange={(value) => updateItem(index, "producto_id", value)}
              >
                <Picker.Item label="Seleccione un producto" value="" />
                {products.map((product) => (
                  <Picker.Item
                    key={`${index}-${product.id}`}
                    label={`${product.codigo_interno} - ${product.nombre}`}
                    value={String(product.id)}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Cantidad</Text>
            <TextInput
              style={styles.input}
              value={item.cantidad}
              onChangeText={(value) => updateItem(index, "cantidad", value)}
              keyboardType="numeric"
              placeholder="1"
            />

            <Text style={styles.label}>Motivo</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={item.motivo}
                onValueChange={(value) => updateItem(index, "motivo", value)}
              >
                {EXIT_REASONS.map((reason) => (
                  <Picker.Item key={`${index}-${reason}`} label={reason} value={reason} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeItem(index)}
              disabled={items.length === 1}
            >
              <Text style={styles.removeButtonText}>Quitar ítem</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={styles.addButtonText}>+ Añadir ítem</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Observación</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={observacion}
          onChangeText={setObservacion}
          placeholder="Observación general"
          multiline
          numberOfLines={4}
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
              {submitting ? "Guardando..." : "Registrar salida"}
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
  helperText: {
    color: theme.colors.muted,
    marginBottom: 16,
    textAlign: "center",
  },
  itemCard: {
    backgroundColor: "#f7f6f4",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
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
    paddingVertical: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    backgroundColor: "#f4f2ee",
    overflow: "hidden",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  removeButton: {
    marginTop: 14,
    alignSelf: "flex-end",
    backgroundColor: theme.colors.danger,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  removeButtonText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: 12,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: theme.colors.white,
    fontWeight: "700",
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