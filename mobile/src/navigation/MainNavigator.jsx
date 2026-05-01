import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import InventoryScreen from "../screens/InventoryScreen";
import AuditScreen from "../screens/AuditScreen";
import AlertsScreen from "../screens/AlertsScreen";
import UsersScreen from "../screens/UsersScreen";
import PlaceholderScreen from "../screens/PlaceholderScreen";
import CreateProductScreen from "../screens/CreateProductScreen";
import EntryScreen from "../screens/EntryScreen";
import ExitScreen from "../screens/ExitScreen";
import CreateUserScreen from "../screens/CreateUserScreen";
import EditUserScreen from "../screens/EditUserScreen";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f3f1ed",
        },
        headerTintColor: "#22232a",
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Inventory" component={InventoryScreen} options={{ title: "Inventario" }} />
      <Stack.Screen name="Audit" component={AuditScreen} options={{ title: "Auditoría" }} />
      <Stack.Screen name="Alerts" component={AlertsScreen} options={{ title: "Alertas" }} />
      <Stack.Screen name="Users" component={UsersScreen} options={{ title: "Usuarios" }} />
      <Stack.Screen name="Placeholder" component={PlaceholderScreen} options={{ title: "Módulo" }} />
      <Stack.Screen name="CreateProduct" component={CreateProductScreen} options={{ title: "Crear Producto" }} />
      <Stack.Screen name="Entry" component={EntryScreen} options={{ title: "Registro de Entrada" }} />
      <Stack.Screen name="Exit" component={ExitScreen} options={{ title: "Registro de Salida" }} />
      <Stack.Screen name="CreateUser" component={CreateUserScreen} options={{ title: "Crear Usuario" }} />
      <Stack.Screen name="EditUser" component={EditUserScreen} options={{ title: "Editar Usuario" }} />
    </Stack.Navigator>
  );
}