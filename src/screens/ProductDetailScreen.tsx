import { View, Text } from "react-native";

export default function ProductDetailScreen({ route }: any) {
  const product = route.params;

  return (
    <View>
      <Text>{product.title}</Text>
      <Text>{product.description}</Text>
      <Text>Price: ${product.price}</Text>
    </View>
  );
}
