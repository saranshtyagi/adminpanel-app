import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CategoriesScreen from "../screens/CategoriesScreen";
import AddCategoryScreen from "../screens/AddCategoryScreen";
import ProductsScreen from "../screens/ProductsScreen";

type CategoriesStackParamList = {
  Categories: undefined;
  AddCategory: undefined;
  Products: { categoryName?: string };
};

const Stack = createNativeStackNavigator<CategoriesStackParamList>();

const CategoriesStack = () => {
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
        name="Categories"
        component={CategoriesScreen}
        options={{ title: "Categories" }}
      />
      <Stack.Screen
        name="AddCategory"
        component={AddCategoryScreen}
        options={{ title: "Add Category" }}
      />
      <Stack.Screen
        name="Products"
        component={ProductsScreen}
        options={({ route }) => ({ title: `Products in ${route.params?.categoryName || 'Category'}`})}
      />
    </Stack.Navigator>
  );
};

export default CategoriesStack;

const styles = StyleSheet.create({});
