import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  AddCategory: undefined;
};

const CategoriesScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View className='flex-1 bg-gray-50'>
      <View className='flex-row items-center justify-between px-4 py-4'>
        <Text className='text-xl font-bold text-gray-900'>Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate("AddCategory")} className='flex-row items-center bg-blue-600 px-3 py-2 rounded-lg'>
                <Ionicons name='add-circle' size={18} color="#fff" />
                <Text className='text-white font-semibold ml-2'>Add</Text>
            </TouchableOpacity>
      </View>
    </View>
  )
}

export default CategoriesScreen

const styles = StyleSheet.create({})