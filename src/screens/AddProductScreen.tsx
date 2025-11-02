import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { createProduct } from "../api/apiClient";

type FormData = {
  name: string;
  price: string;
  imageUrl?: string;
  description?: string;
};

const AddProductScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId } = (route?.params as any) ?? { categoryId: "" };
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { name: "", price: "", imageUrl: "", description: "" },
  });


  const mutation = useMutation({
    mutationFn:(data:FormData) => createProduct({...data, price:parseFloat(data.price), categoryId}), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", categoryId] });
      navigation.goBack();
    }, 
    onError: (error) => {
      console.error("Error creating product:", error);
      Alert.alert("Error", "There was an error creating the product. Please try again.");
    }
  }); 

  const onSubmit = (data: FormData) => {
    if(!data.name || !data.price || !data.imageUrl) return;
    mutation.mutate(data);
  }

  return (
    <ScrollView className="flex-1 bg-grary-50 p-4">
      <Text className="text-lg font-bold text-gray-900 mb-2">
        Add New Product
      </Text>
      <Text className="text-sm text-gray-600 mb-4">
        Fill Product Details Below
      </Text>
      <Text className="text-sm font-medium text-gray-700 mb-2">
        Product Name
      </Text>
      <Controller
        control={control}
        name="name"
        rules={{ required: "Product name is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="E.g Azithromycin"
            value={value}
            onChangeText={onChange}
            className="bg-white p-3 rounded-lg border border-gray-200"
          />
        )}
      />
      {errors?.name && (
        <Text className="text-red-500 mt-2">{errors.name.message}</Text>
      )}

      <Text className="text-sm font-medium text-gray-700 mb-2 mt-2">Price</Text>
      <Controller
        control={control}
        name="price"
        rules={{
          required: "Price is required",
          pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Invalid price" },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="E.g 80.57"
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
            className="bg-white p-3 rounded-lg border border-gray-200"
          />
        )}
      />
      {errors?.price && (
        <Text className="text-red-500">{errors.price.message}</Text>
      )}
      <Text className="text-sm font-medium text-gray-700 mb-2 mt-2">Image URL</Text>
      <Controller
        control={control}
        name="imageUrl"
        rules={{
          required: "Image URL is required",
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Image URL"
            value={value}
            onChangeText={onChange}
            className="bg-white p-3 rounded-lg border border-gray-200"
          />
        )}
      />
      {errors?.imageUrl && (
        <Text className="text-red-500">{errors.imageUrl.message}</Text>
      )}
      <Text className="text-sm font-medium text-gray-700 mb-2 mt-4">Description (Optional)</Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Short description"
            value={value}
            onChangeText={onChange}
            multiline
            textAlignVertical="top"
            className="bg-white p-3 rounded-lg border border-gray-200 h-28"
          />
        )}
      />
      <TouchableOpacity onPress={handleSubmit(onSubmit)} className="mt-6 bg-black p-3 rounded-lg flex-row items-center justify-center">
        <Ionicons name="save" size={18} color="#fff" />
        <Text className="text-white font-semibold ml-2">Create Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddProductScreen;

const styles = StyleSheet.create({});
