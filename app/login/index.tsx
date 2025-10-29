import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Checkbox from "expo-checkbox";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { router } from "expo-router";
interface FormData {
  username: string;
  password: string;
  agree: boolean;
}
const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    agree: false,
  });

  const submit = async (): Promise<void> => {
    const { username, password, agree } = formData;

    if (!agree) {
      Alert.alert("Error", "Please accept Terms & Conditions");
      return;
    }

    if (!username || !password) {
      Alert.alert("Error", "Email and Password cannot be empty");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      const user = userCredential.user;
      Alert.alert("Login Successful", `Welcome, ${user.email}`);
      router.replace("/home/Home");
      setFormData({
        username: "",
        password: "",
        agree: false,
      });
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Login Form</Text>
      <Text style={styles.formdes}>
        You can reach us anytime via email and password
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={formData.username}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={(text: string) =>
          setFormData({ ...formData, username: text })
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text: string) =>
          setFormData({ ...formData, password: text })
        }
      />

      <View style={styles.checkboxContainer}>
        <Checkbox
          value={formData.agree}
          onValueChange={(val: boolean) =>
            setFormData({ ...formData, agree: val })
          }
          color={formData.agree ? "blue" : undefined}
        />
        <Text style={styles.label}>Accept Terms & Conditions</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: formData.agree ? "blue" : "#bbbbbb" },
        ]}
        onPress={submit}
        disabled={!formData.agree}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 35,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    height: 50,
    borderColor: "rgba(0,0,0,0.3)",
    color: "#333",
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "blue",
    marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  formdes: {
    fontSize: 16,
    textAlign: "center",
    paddingBottom: 20,
    lineHeight: 25,
    color: "#333",
    textTransform: "capitalize",
    letterSpacing: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "flex-start",
  },
  label: {
    marginLeft: 10,
    fontSize: 18,
    color: "#333",
  },
});

export default LoginForm;
