import { StyleSheet, View } from "react-native";
import AccelerationGraph from "./Acceleration/AcclerationGraph";

export default function index() {
  return (
    <View style={styles.container}>
      <AccelerationGraph />
      {/* <SpeedGraph /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
