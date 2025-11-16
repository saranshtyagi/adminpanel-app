import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrderById } from "../../admin-backend/api/apiClient";
import { SafeAreaView } from "react-native-safe-area-context";

const OrderDetailScreen = () => {
  const route = useRoute();
  const { orderId } = route?.params as { orderId: string };
  const queryClient = useQueryClient();
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId),
  });

  if (isLoading || !order) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({
    item,
  }: {
    item: { productId: string; quantity: number; price: number; name?: string };
  }) => (
    <View className="bg-gray-100 p-3 my-1 rounded-xl">
      <Text className="text-sm text-gray-800">
        {item?.name || `Product ${item?.productId}`} - Qty: {item.quantity} ·{" "}
        {item?.price}
      </Text>
    </View>
  );

  return (
    <SafeAreaView>
      <View className="bg-white p-4 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-800">
          Order #{orderId.slice(0, 8)}
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          {new Date(order.createdAt).toLocaleString()}
        </Text>
      </View>
      <View className="p-4">
        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
          <Text className="text-sm text-gray-500">Total</Text>
          <Text className="text-lg font-semibold text-gray-800 mt-1">
            Rs {order.totalAmount}
          </Text>
          <View className="flex-row justify-between items-center mt-3">
            <Text className="text-sm text-gray-500">Status</Text>
            <Text className="text-sm font-medium text-gray-700">
              {order?.status}
            </Text>
          </View>
          <View className="mt-3">
            <Text className="text-sm text-gray-500">User</Text>
            <Text className="text-sm font-medium text-gray-700">
              {order?.user?.name || order?.user?.email}
            </Text>
          </View>
          <View className="mt-3">
            <Text className="text-sm text-gray-500">Address</Text>
            <Text className="text-sm text-gray-800 mt-1">
              {typeof order.address == "string"
                ? order?.address
                : JSON.stringify(order.address)}
            </Text>
          </View>
        </View>
        <Text className="text-base font-semibold text-gray-700 mb-2">
          Items
        </Text>

        <FlatList
          data={order.items}
          renderItem={renderItem}
          keyExtractor={(item) => item.productId}
          className="mb-4"
        />
        <View className="flex-row justify-between mt-4 space-x-2">
          {["Pending", "Shipped", "Delivered", "Cancelled"].map((status) => (
            <TouchableOpacity
              key={status}
              className={`flex-1 px-3 py-2 rounded-lg items-center ${
                status === order.status
                  ? "bg-indigo-600"
                  : "bg-white border border-gray-200"
              }`}
              activeOpacity={0.85}
            >
              <Text
                className={`${
                  status === order.status ? "text-white" : "text-gray-700"
                } text-sm font-medium`}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({});
