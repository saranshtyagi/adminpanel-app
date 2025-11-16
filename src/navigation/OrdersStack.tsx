import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../../admin-backend/api/apiClient";
import OrdersScreen from "../screens/OrdersScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrderDetailScreen from "../screens/OrderDetailScreen";



const OrdersStack = () => {
  const Stack  = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "tomato" },
        headerTintColor: "white",
        headerTitleStyle: { fontWeight: "bold" },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ title: "Orders" }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailScreen}
        options={{ title: "Order Details" }}
      />
    </Stack.Navigator>
  );
};

export default OrdersStack;

const styles = StyleSheet.create({});
