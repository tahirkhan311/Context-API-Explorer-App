import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { View, FlatList, TextInput, StyleSheet } from "react-native";
import { ApiContext } from "../context/ApiContext";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { useToast } from "../components/Toast";

export default function ProductListScreen({ navigation }: any) {
  const { products, fetchProducts, loading, canLoadMore, query } = useContext(ApiContext);
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    // initial load
    fetchProducts({ reset: true });
  }, []);

  const onRefresh = useCallback(() => fetchProducts({ reset: true, search: "" }), []);

  const onEndReached = () => {
    if (!loading && canLoadMore()) {
      fetchProducts({ reset: false, search: search || "" });
    }
  };

  const onSearchSubmit = () => {
    // server-side search on submit
    if (search.trim().length === 0) {
      fetchProducts({ reset: true, search: "" });
      return;
    }
    fetchProducts({ reset: true, search });
  };

  // Client-side filtering while typing
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const displayed = useMemo(() => {
    if (!localSearch || localSearch.trim().length === 0) return products;
    const q = localSearch.toLowerCase();
    return products.filter((p: any) => (p.title || "").toLowerCase().includes(q));
  }, [products, localSearch]);

  if (loading && products.length === 0) {
    return <Loader />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Search products"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={onSearchSubmit}
          style={styles.search}
        />
      </View>

      <FlatList
        data={displayed}
        keyExtractor={(item: any) => item.id.toString()}
        refreshing={loading}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        renderItem={({ item }: any) => (
          <ProductCard product={item} onPress={() => navigation.navigate("Details", item)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrapper: { padding: 10 },
  search: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8 },
});

