import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button } from "react-native";
import LoginScreen from "../screens/LoginScreen";
import ProductListScreen from "../screens/ProductListScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { token, initializing, logout } = useContext(AuthContext);

  if (initializing) return <Loader />;

  const LogoutButton = () => (
    <Button title="Logout" onPress={() => logout()} />
  );

  return (
    <Stack.Navigator>
      {token === null ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Products"
            component={ProductListScreen}
            options={{ headerRight: () => <LogoutButton /> }}
          />
          <Stack.Screen name="Details" component={ProductDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
