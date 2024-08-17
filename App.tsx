import { StatusBar } from "expo-status-bar";
import Sensors from "./app/screens/Sensors";
import SensorContextProvider from "./Context/ContextProvider";

export default function App() {
  return (
    <SensorContextProvider>
      <StatusBar style="auto" />
      <Sensors />
    </SensorContextProvider>
  );
}
