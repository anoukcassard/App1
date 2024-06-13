import { Text, View } from "react-native";
import Name from '@/components/Name';
import React from 'react';
import { Link, Stack, useLocalSearchParams } from "expo-router";


export default function Next() {
  const{name}=useLocalSearchParams();
  return (
    <><Stack.Screen options={{title: name}}/>
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
     <Link href={"/users"}>Users</Link>
      <Text>Next <Name name={"Username"} /></Text>
    </View></>
  );
}
