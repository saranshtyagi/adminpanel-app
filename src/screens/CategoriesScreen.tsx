import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteCategory, fetchCategories } from "../api/apiClient";
import { Alert } from "react-native";

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  products?: any[];
}

type RootStackParamList = {
  AddCategory: undefined;
  EditCategory: {
    categoryId: string;
    categoryName: string;
  };
  Products: {
    categoryId: string;
    categoryName: string;
  };
};

const CategoriesScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => Alert.alert("Error", "Failed to delete category"),
  });

  const handleDelete = (id: string, name: string, productCount: number) => {
    const message =
      productCount > 0
        ? `Are you sure you want to delete ${name}? This will also delete its ${productCount} product${productCount > 1 ? "s" : ""}`
        : `Are you sure you want to delete ${name}category?`;
    Alert.alert("Delete Category", message, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate(id),
      },
    ]);
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Products", {
          categoryId: item?.id,
          categoryName: item?.name,
        })
      }
      className="bg-white rounded-xl p-4 mx-3 my-2 flex-row items-center shadow"
    >
      <Image
        className="w-14 h-14 rounded-lg mr-4 bg-gray-100"
        source={{
          uri:
            item.imageUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              item.name
            )}&background=E6F0FF&color=1F2937`,
        }}
      />
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800">
          {item?.name}
        </Text>
        <Text className="text-xs text-gray-500 mt-1">
          {(item.products?.length ?? 0) +
            " product" +
            ((item.products?.length ?? 0) === 1 ? "" : "s")}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <TouchableOpacity onPress={() => navigation.navigate("EditCategory", {
          categoryId:item.id, 
          categoryName:item?.name
        })} className="p-2 rounded-md mr-2 bg-blue-50">
          <Ionicons name="pencil" size={18} color="#256E3EB" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            handleDelete(item?.id, item?.name, item?.products?.length ?? 0)
          }
          className="p-2 rounded-md bg-red-50"
        >
          <Ionicons name="trash" size={18} color="#DC2626" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between px-4 py-4">
        <Text className="text-xl font-bold text-gray-900">Categories</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddCategory")}
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
      ) : categories?.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="layers" size={48} color="#9CA3AF" />
          <Text className="text-lg font-semibold text-gray-800 mt-4">
            No Categories Yet
          </Text>
          <Text className="text-sm text-gray-500 mt-2 text-center">
            Create Categories to organize your products
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("AddCategory")}
            className="mt-4 bg-blue-600 px-4 py-2 rounded-md"
          >
            <Text className="text-white font-semibold">Create category</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({});
