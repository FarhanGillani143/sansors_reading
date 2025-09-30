import React, { useEffect, useState } from "react";
import { TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { router } from "expo-router";
import FeatherIcons from "react-native-vector-icons/Feather";
import { app } from "../app/firebaseConfig";

export default function AuthButton() {
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 User ki login/logout state track karo
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      Alert.alert("Success", "You have been logged out successfully.");
      router.push("/login");
    } catch (error: any) {
      console.log("Logout error:", error.message);
      Alert.alert("Error", "Something went wrong during logout.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <TouchableOpacity
        style={{
          width: 40,
          alignItems: "center",
          justifyContent: "center",
          padding: 8,
        }}
        onPress={() => router.push("/login")}
      >
        <FeatherIcons name="log-in" size={22} color="#333" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={{
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
      }}
      onPress={handleLogout}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="red" />
      ) : (
        <FeatherIcons name="log-out" size={22} color="red" />
      )}
    </TouchableOpacity>
  );
}
