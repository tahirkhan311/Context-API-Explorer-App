import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/context/AuthContext";
import { ApiProvider } from "./src/context/ApiContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { ToastProvider } from "./src/components/Toast";
import Loader from "./src/components/Loader";
import ProductListScreen from "./src/screens/ProductListScreen";
import LoginScreen from "./src/screens/LoginScreen";



export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <ApiProvider>
            <NavigationContainer>
              <StatusBar style="auto" hidden={false} />
              <AppNavigator />
            </NavigationContainer>
          </ApiProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
