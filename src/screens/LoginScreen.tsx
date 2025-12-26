import React, { useContext, useState } from "react";
import { View, TextInput, Button, StyleSheet, Platform } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen() {
  const { login, loading } = useContext(AuthContext);

  const isWeb = Platform.OS === "web";
  const [email, setEmail] = useState(isWeb ? "Tahir" : "eve.holt@reqres.in");
  const [password, setPassword] = useState(isWeb ? "abajan" : "abajan");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={isWeb ? "Username (Tahir)" : "Email (eve.holt@reqres.in)"}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={() => login(email, password)}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
  },
});
