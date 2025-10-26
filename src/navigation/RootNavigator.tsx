// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import UsersScreen from "../screens/UsersScreen";
// import CategoriesStack from "./CategoriesStack";
// import OrdersStack from "./OrdersStack";
// import { Ionicons } from '@expo/vector-icons';


// export type RootTabParamList = {
//     CategoriesTab:undefined;
//     Users: undefined;
//     OrdersTab: undefined;
// }

// const Tab = createBottomTabNavigator<RootTabParamList>();

// const RootNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName: keyof typeof Ionicons.glyphMap = "home";

//           if (route.name === "CategoriesTab") {
//             iconName = focused ? "list" : "list-outline";
//           } else if (route.name === "Users") {
//             iconName = focused ? "people" : "people-outline";
//           } else if (route.name === "OrdersTab") {
//             iconName = focused ? "cart" : "cart-outline";
//           }

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: "tomato",
//         tabBarInactiveTintColor: "gray",
//         headerShown: false,
//       })}
//     >
//       <Tab.Screen
//         name="CategoriesTab"
//         component={CategoriesStack}
//         options={{ title: "Categories" }}
//       />
//       <Tab.Screen
//         name="Users"
//         component={UsersScreen}
//         options={{ title: "Users" }}
//       />
//       <Tab.Screen
//         name="OrdersTab"
//         component={OrdersStack}
//         options={{ title: "Orders" }}
//       />
//     </Tab.Navigator>
//   );
// };

// export default RootNavigator;
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UsersScreen from "../screens/UsersScreen";
import CategoriesStack from "./CategoriesStack";
import OrdersStack from "./OrdersStack";
import { Ionicons } from "@expo/vector-icons";

export type RootTabParamList = {
  CategoriesTab: undefined;
  Users: undefined;
  OrdersTab: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          if (route.name === "CategoriesTab") iconName = focused ? "list" : "list-outline";
          else if (route.name === "Users") iconName = focused ? "people" : "people-outline";
          else if (route.name === "OrdersTab") iconName = focused ? "cart" : "cart-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="CategoriesTab" component={CategoriesStack} options={{ title: "Categories" }} />
      <Tab.Screen name="Users" component={UsersScreen} options={{ title: "Users" }} />
      <Tab.Screen name="OrdersTab" component={OrdersStack} options={{ title: "Orders" }} />
    </Tab.Navigator>
  );
};

export default RootNavigator;
