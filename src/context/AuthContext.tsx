import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

type AuthContextType = {
  token: string | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  // Load token on app start
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) setToken(storedToken);
      } catch (e) {
        console.error("Failed to load token", e);
      } finally {
        setInitializing(false);
      }
    };
    loadToken();
  }, []);

  // LOGIN FUNCTION (WEB + MOBILE SAFE)
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      let response;

      if (Platform.OS === "web") {
        // Use local mock API on web
        response = await axios.post(
          "http://localhost:3000/auth",
          {
            username: "kminchelle",
            password: "0lelplR",
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        response = await axios.post(
          "https://reqres.in/api/login",
          {
            email,
            password,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      console.log("LOGIN RESPONSE:", response?.data);

      const authToken = response?.data?.token;
      if (!authToken) {
        console.log("LOGIN RESPONSE (no token):", response?.data);
        throw new Error("Authentication failed: no token returned");
      }
      setToken(authToken);
      await AsyncStorage.setItem("token", authToken);
    } catch (error: any) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      console.error("LOGIN ERROR message:", error?.message);
      if (status) console.error("LOGIN ERROR status:", status);
      if (data) console.error("LOGIN ERROR data:", typeof data === "string" ? data : JSON.stringify(data, null, 2));
      if (error?.config) console.error("LOGIN ERROR request:", {
        url: error.config.url,
        method: error.config.method,
        data: error.config.data,
        headers: error.config.headers,
      });

      const serverMsg = data && (data.message || data.error || data?.errors || JSON.stringify(data));
      const userMessage = serverMsg || error?.message || "Unknown error";
      alert(`Login failed: ${userMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setToken(null);
    await AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, initializing, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
