import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  useNavigation,
  useRoute,
  NavigationProp,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProductsByCategory } from "../api/apiClient";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
};

type RootStackParamList = {
  AddProduct: { categoryId: string };
};

const ProductsScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { categoryId, categoryName } = (route?.params as any) ?? {
    categoryId: "",
    categoryName: "",
  };

  const queryClient = useQueryClient();

  const {data:products, isLoading, error, refetch} = useQuery<Product[]>({
    queryKey: ['products', categoryId], 
    queryFn:() => fetchProductsByCategory(categoryId), 
    enabled: !!categoryId
  })

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between px-4 py-4">
        <Text className="text-xl font-bold text-gray-900">
          {categoryName ? `${categoryName}Products` : `Products`}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddProduct", {categoryId})}
          className="flex-row items-center bg-blue-600 px-3 py-2 rounded-lg"
        >
          <Ionicons name="add-circle" size={18} color="#fff" />
          <Text className="text-white font-semibold ml-2">Add</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <View>
            <ActivityIndicator size={"large"} />
        </View>
      ) : (
        // <FlatList data={products ?? []} renderItem={renderProduct} keyExtractor={(item) => item.id} />
        null
      )}
    </View>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({});
