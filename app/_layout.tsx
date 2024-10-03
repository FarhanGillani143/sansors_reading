import { Stack } from "expo-router";

import ConfigurationButton from "../components/ConfigurationButton";
import SensorContextProvider from "../context/SensorsData/ContextProvider";
import ConfigurationContextProvider from "../context/Configuration/ContextProvider";

export default function _layout() {
  return (
    <ConfigurationContextProvider>
      <SensorContextProvider>
        <Stack
          screenOptions={{
            headerTitleAlign: "center",
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "Sensor Readings",
              headerRight: ConfigurationButton,
            }}
          />
          <Stack.Screen name="data/index" options={{ title: "Sensors Data" }} />
          <Stack.Screen
            name="history/index"
            options={{ title: "Sessions History" }}
          />
          <Stack.Screen
            name="acceleration/index"
            options={{ title: "Acceleration" }}
          />
          <Stack.Screen
            name="configuration/index"
            options={{ title: "Configuration" }}
          />
        </Stack>
      </SensorContextProvider>
    </ConfigurationContextProvider>
  );
}
