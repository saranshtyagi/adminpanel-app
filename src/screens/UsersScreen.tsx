import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../../admin-backend/api/apiClient";
import { SafeAreaView } from "react-native-safe-area-context";

interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
}

const UsersScreen = () => {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const renderUser = ({ item }: { item: User }) => (
    <View className="bg-white p-4 mx-4 my-3 rounded-2xl shadow-lg border border-gray-100 flex-row items-center">
      <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center">
        <Text className="text-base font-semibold text-gray-700">
          {(item.name
            ? item.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
            : "U"
          ).toUpperCase()}
        </Text>
      </View>
      <View className="ml-4 flex-1">
        <Text className="text-lg font-semibold text-gray-800">{item?.name ? item?.name : 'Name is not provided'}</Text>
        <Text className="text-sm text-gray-500 mt-1">{item?.email}</Text>
      </View>
      {/* <View>
        <View>
          <Text>{item.role}</Text>
        </View>
      </View> */}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-indigo-600 p-5 border-b border-indigo-700">
        <Text className="text-2xl font-bold text-white text-center">Users</Text>
        <Text className="text-sm text-indigo-100 text-center mt-1">
          Manage Application Users
        </Text>
      </View>

      {isLoading ? (
        <View>
          <Text>Loading Users...</Text>
        </View>
      ) : users && users.length > 0 ? (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-lg text-gray-600 mt-4 text-center">
            No users found
          </Text>
          <Text className="text-sm text-gray-400 mt-1 text-center">
            Try adding users from the admin panel
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default UsersScreen;

const styles = StyleSheet.create({});
