import { useCallback, useEffect, useState } from "react";
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
import { getCategoriesRequest, getProductsRequest } from "../api/productsApi";
import { useAuth } from "../context/AuthContext";
import { theme } from "../styles/theme";

export default function InventoryScreen({ navigation }) {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.rol === "ADMINISTRADOR";
  const canRegisterEntry =
    user?.rol === "ADMINISTRADOR" || user?.rol === "OPERARIO";

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const loadCategories = async () => {
    try {
      const data = await getCategoriesRequest();
      setCategories(data);
    } catch (err) {
      console.log("CATEGORIES ERROR:", err?.response?.data || err?.message);
    }
  };

  const loadProducts = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      const data = await getProductsRequest({
        query,
        categoria_id: categoriaId,
        page,
        page_size: pageSize,
      });

      setProducts(data.items);
      setTotal(data.total);
    } catch (err) {
      console.log("PRODUCTS ERROR:", err?.response?.data || err?.message);
      setError(err?.response?.data?.detail || "No se pudo cargar el inventario");
    } finally {
      setLoading(false);
    }
  }, [query, categoriaId, page, pageSize]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, categoriaId]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const renderCategoryFilters = () => (
    <View style={styles.categoriesRow}>
      <TouchableOpacity
        style={[
          styles.categoryChip,
          categoriaId === "" && styles.categoryChipActive,
        ]}
        onPress={() => setCategoriaId("")}
      >
        <Text
          style={[
            styles.categoryChipText,
            categoriaId === "" && styles.categoryChipTextActive,
          ]}
        >
          Todas
        </Text>
      </TouchableOpacity>

      {categories.map((category) => {
        const active = String(categoriaId) === String(category.id);

        return (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryChip, active && styles.categoryChipActive]}
            onPress={() => setCategoriaId(String(category.id))}
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
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.nombre}</Text>
      <Text style={styles.cardText}>Código: {item.codigo_interno}</Text>
      <Text style={styles.cardText}>Categoría: {item.categoria}</Text>
      <Text style={styles.cardText}>Stock actual: {item.stock_actual}</Text>
      <Text style={styles.cardText}>Stock mínimo: {item.stock_minimo}</Text>
      <Text style={styles.cardText}>
        Estado: {item.activo ? "Activo" : "Inactivo"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por código, nombre o descripción"
          value={query}
          onChangeText={setQuery}
        />

        <View style={styles.actionsRow}>
          {isAdmin && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate("CreateProduct")}
            >
              <Text style={styles.createButtonText}>Nuevo producto</Text>
            </TouchableOpacity>
          )}

          {canRegisterEntry && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Entry")}
            >
              <Text style={styles.createButtonText}>Registrar entrada</Text>
            </TouchableOpacity>
          )}
          {canRegisterEntry && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Exit")}
            >
      <Text style={styles.createButtonText}>Registrar salida</Text>
    </TouchableOpacity>
  )}
        </View>
      </View>

      {renderCategoryFilters()}

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
            data={products}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.infoText}>No se encontraron productos.</Text>
            }
          />

          <View style={styles.paginationRow}>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                page === 1 && styles.paginationButtonDisabled,
              ]}
              disabled={page === 1}
              onPress={() => setPage((prev) => prev - 1)}
            >
              <Text style={styles.paginationButtonText}>Anterior</Text>
            </TouchableOpacity>

            <Text style={styles.pageText}>
              Página {page} de {totalPages}
            </Text>

            <TouchableOpacity
              style={[
                styles.paginationButtonPrimary,
                page >= totalPages && styles.paginationButtonDisabled,
              ]}
              disabled={page >= totalPages}
              onPress={() => setPage((prev) => prev + 1)}
            >
              <Text style={styles.paginationButtonText}>Siguiente</Text>
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
  topSection: {
    gap: 12,
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    backgroundColor: "#f4f2ee",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  createButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#4a79c9",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  createButtonText: {
    color: theme.colors.white,
    fontWeight: "700",
  },
  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
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
  listContent: {
    paddingBottom: 16,
    gap: 10,
  },
  card: {
    backgroundColor: "#f7f6f4",
    borderRadius: 14,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: theme.colors.text,
  },
  cardText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 3,
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
  paginationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  paginationButton: {
    backgroundColor: theme.colors.dark,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  paginationButtonPrimary: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  paginationButtonDisabled: {
    opacity: 0.4,
  },
  paginationButtonText: {
    color: theme.colors.white,
    fontWeight: "700",
  },
  pageText: {
    flex: 1,
    textAlign: "center",
    color: theme.colors.text,
    fontWeight: "600",
  },
});