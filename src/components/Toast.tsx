import React, { createContext, useContext, useState, useCallback } from "react";
import { Animated, Text, View, StyleSheet } from "react-native";

type ToastContextType = {
  showToast: (message: string, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: any) => {
  const [message, setMessage] = useState<string | null>(null);
  const [anim] = useState(new Animated.Value(0));

  const showToast = useCallback((msg: string, duration = 3000) => {
    setMessage(msg);
    Animated.timing(anim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    setTimeout(() => {
      Animated.timing(anim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => setMessage(null));
    }, duration);
  }, [anim]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message ? (
        <Animated.View style={[styles.container, { opacity: anim }]}> 
          <View style={styles.toast}><Text style={styles.text}>{message}</Text></View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext) as ToastContextType;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 40,
    alignItems: "center",
    zIndex: 9999,
  },
  toast: {
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    maxWidth: "90%",
  },
  text: { color: "#fff" },
});

export default function Toast() {
  return null; // Component exists via provider
}
