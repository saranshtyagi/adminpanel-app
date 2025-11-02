import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  useNavigation,
  useRoute,
  NavigationProp,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, fetchProductsByCategory } from "../api/apiClient";

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

  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery<Product[]>({
    queryKey: ["products", categoryId],
    queryFn: () => fetchProductsByCategory(categoryId),
    enabled: !!categoryId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", categoryId] });
    },
  })

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      "Delete Product", 
      `Are you sure you want to delete ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMutation.mutate(id),
        },
      ]
    );
  }
 
  const renderProduct = ({ item }: { item: Product }) => (
    <View className="bg-white rounded-xl p-4 mx-3 my-2 flex-row items-start shadow">
      <Image
        source={{ uri: item?.imageUrl }}
        className="w-20 h-20 rounded-md mr-4 bg-gray-100"
      />
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800">
          {item?.name}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          {item?.price.toFixed(2)}
        </Text>
        <Text className="text-sm text-gray-400 mt-2">
          {item.description
            ? item.description.length > 80
              ? item.description.slice(0, 80) + "..."
              : item.description
            : "No Description"}
        </Text>
      </View>

      <View className="ml-3 justify-between">
        <TouchableOpacity className="p-2 rounded-md mr-2 bg-blue-50">
          <Ionicons name="pencil" size={18} color="#256E3EB" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item?.id, item?.name)}
          className="p-2 rounded-md bg-red-50"
        >
          <Ionicons name="trash" size={18} color="#DC2626" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between px-4 py-4">
        <Text className="text-xl font-bold text-gray-900">
          {categoryName ? `${categoryName}Products` : `Products`}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AddProduct", { categoryId: categoryId })
          }
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
        <FlatList
          data={products ?? []}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-8">
              No Products Found
            </Text>
          }
        />
      )}
    </View>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({});
