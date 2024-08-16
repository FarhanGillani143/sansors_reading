import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AccelerometerSensor from "./sensors/Accelerometer/Accelerometer";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <AccelerometerSensor />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
