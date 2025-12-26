import React, { createContext, useState } from "react";
import api from "../services/api";
import { useToast } from "../components/Toast";

export const ApiContext = createContext<any>(null);

export const ApiProvider = ({ children }: any) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [total, setTotal] = useState<number | null>(null);
  const [query, setQuery] = useState<string>("");

  const { showToast } = useToast();

  const fetchProducts = async ({ reset = false, search = "" } = {}) => {
    try {
      setLoading(true);
      const nextPage = reset ? 0 : page;
      const skip = nextPage * limit;

      let url = "https://dummyjson.com/products";
      // search endpoint
      if (search && search.trim().length > 0) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}`;
      } else {
        url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
      }

      const res = await api.get(url);
      const received = res.data.products || [];
      const receivedTotal = res.data.total || null;

      if (reset) {
        setProducts(received);
        setPage(1);
      } else {
        setProducts((p) => [...p, ...received]);
        setPage((prev) => prev + 1);
      }

      setTotal(receivedTotal);
      setQuery(search);
    } catch (err: any) {
      console.error("API fetch error", err?.response || err?.message || err);
      showToast?.("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const canLoadMore = () => {
    if (total === null) return true;
    return products.length < total;
  };

  return (
    <ApiContext.Provider value={{ products, fetchProducts, loading, canLoadMore, page, limit, total, query }}>
      {children}
    </ApiContext.Provider>
  );
};
