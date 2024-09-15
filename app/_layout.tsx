import { Stack } from "expo-router";
import SensorContextProvider from "../context/ContextProvider";

export default function _layout() {
  return (
    <SensorContextProvider>
      <Stack
        screenOptions={{
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ title: "Sensor Readings" }} />
        <Stack.Screen name="data/index" options={{ title: "Data" }} />
        <Stack.Screen
          name="history/index"
          options={{ title: "Session History" }}
        />
        <Stack.Screen name="graphs/index" options={{ title: "D3js Line" }} />
      </Stack>
    </SensorContextProvider>
  );
}
