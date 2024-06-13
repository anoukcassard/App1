import { Text, View } from "react-native";
import Counter from '@/components/AllComponents';
import Name from '@/components/Name'
import React from 'react';
import { Link } from "expo-router";


export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Counter />
      
      <Link href={"/users/anna"}>Anna</Link>
      <Link href={"/users/nathanael"}>Nathanael</Link>
      <Link href={"/home"}>Home</Link>
      <Text>Ce composant a été codé par <Name name={"ANNNOUUUKKKK"} /></Text>
    </View>

  );
}