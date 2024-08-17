import { Stack } from "expo-router";
import SensorContextProvider from "../context/ContextProvider";

export default function _layout() {
  return (
    <SensorContextProvider>
      <Stack screenOptions={{ headerBackTitleVisible: false }}>
        <Stack.Screen name="index" options={{ title: "Sensor Readings" }} />
        <Stack.Screen name="data/index" options={{ title: "Data" }} />
      </Stack>
    </SensorContextProvider>
  );
}
