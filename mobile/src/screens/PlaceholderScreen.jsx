import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { theme } from "../styles/theme";

export default function PlaceholderScreen({ route }) {
  const title = route?.params?.title || "Pantalla";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>Vista placeholder en esta iteración.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.panel,
    padding: 20,
  },
  box: {
    backgroundColor: "#f7f6f4",
    borderRadius: 14,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    color: theme.colors.text,
  },
  text: {
    fontSize: 15,
    color: theme.colors.muted,
  },
});