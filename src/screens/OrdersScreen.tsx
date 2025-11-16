import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../../admin-backend/api/apiClient";

type OrderItem = {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  user?: {
    name: string;
    email?: string;
  };
};

const currency = (value: number) =>
  Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const OrdersScreen = () => {
  const navigation = useNavigation();

  const { data: orders, isLoading } = useQuery<OrderItem[]>({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const statusStyles = (status: string) => {
    const s = (status || "").toLowerCase();

    if (s === "delivered")
      return "bg-emerald-100 border-emerald-200 text-emerald-700";

    if (s === "shipped")
      return "bg-indigo-100 border-indigo-200 text-indigo-700";

    if (s === "processing")
      return "bg-yellow-100 border-yellow-200 text-yellow-700";

    if (s === "cancelled" || s === "refunded")
      return "bg-rose-100 border-rose-200 text-rose-700";

    return "bg-green-100 border-gray-200 text-gray-700";
  };

  const renderOrder = ({ item }: { item: OrderItem }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("OrderDetails" as never, { orderId: item?.id} as never)
      }
      className="bg-white mx-3 my-2 p-4 rounded-2xl border border-gray-100 shadow-sm"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1 pr-3">
          <Text className="text-base font-semibold text-gray-800">
            Order #{item.id.slice(0, 8)}
          </Text>
          <Text>
            {item?.user?.name ?? item?.user?.email ?? "Unknown Customer"}
          </Text>
        </View>
        <View className="items-end">
          <View
            className={`px-3 py-1 rounded-full border ${statusStyles(item.status)}`}
          >
            <Text className="text-xs font-medium">{item?.status}</Text>
          </View>
        </View>
      </View>
      <View className="flex-row justify-between items-center mt-3">
        <Text className="text-sm text-gray-600">Total</Text>
        <Text className="text-sm font-semibold text-gray-800">
          {currency(item?.totalAmount)}
        </Text>
      </View>
      <View className="flex-row justify-between items-center mt-2">
        <Text className="text-xs text-gray-400">
          {new Date(item.createdAt).toLocaleString()}
        </Text>
        <Text className="text-xs text-gray-400">View details →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-gradient-to-r from-sky-600 to-indigo-600 p-5">
        <Text className="text-2xl font-bold text-center">Orders</Text>
        <Text>
          {isLoading
            ? "Loading Orders..."
            : `Showing ${orders?.length} order(s)`}
        </Text>
      </View>
      {isLoading ? (
        <View>
          <Text>Loading Orders...</Text>
        </View>
      ) : orders && orders?.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 12, paddingBottom: 36 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 justify-center items-center px-8">
          <View className="w-40 h-40 rounded-xl bg-white border border-gray-100 shadow-sm justify-center items-center">
            <Text className="text-4xl"></Text>
          </View>
          <Text className="text-lg text-gray-600 mt-6 text-center">
            No orders yet
          </Text>
          <Text className="text-sm text-gray-400 mt-1 text-center">
            Orders will show up here when customers place them
          </Text>
        </View>
      )}
    </View>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({});
