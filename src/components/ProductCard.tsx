import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

type Props = {
  product: Product;
  onPress: () => void;
};

export default function ProductCard({ product, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: product.thumbnail }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 8,
    elevation: 3,
    padding: 10,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 6,
    marginRight: 10,
  },
  info: {
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  price: {
    marginTop: 4,
    fontSize: 14,
    color: "green",
  },
});
