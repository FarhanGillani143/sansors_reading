import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../app/firebaseConfig";
import ConfigurationButton from "../components/ConfigurationButton";
import LoginButton from "../components/LoginButton";
import SignupButton from "../components/SignUpButton";
import LogOutButton from "../components/LogOutButton";
import SensorContextProvider from "../context/SensorsData/ContextProvider";
import ConfigurationContextProvider from "../context/Configuration/ContextProvider";
import SensorsConfigContextProvider from "../context/SensorsConfig/ContextProvider";

export default function _layout() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  return (
    <ConfigurationContextProvider>
      <SensorsConfigContextProvider>
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
                headerRight: () => (
                  <>
                    {user ? (
                      <LogOutButton />
                    ) : (
                      <>
                        <LoginButton />
                        <SignupButton />
                      </>
                    )}
                    <ConfigurationButton />
                  </>
                ),
              }}
            />
            <Stack.Screen
              name="data/index"
              options={{ title: "Sensors Data" }}
            />
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
            <Stack.Screen name="login/index" options={{ title: "Login" }} />
            <Stack.Screen name="signup/index" options={{ title: "Sign Up" }} />
          </Stack>
        </SensorContextProvider>
      </SensorsConfigContextProvider>
    </ConfigurationContextProvider>
  );
}
