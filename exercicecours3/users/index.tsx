import { Alert, Button, Text, View } from "react-native";
import Name from '@/components/Name';
import React from 'react';
import { Link } from "expo-router";



export default function Users() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
       
       <Link href={"/users/anna"}>Anna</Link>
      <Link href={"/users/nathanael"}>Nathanael</Link>
        <Text>Bonjour, comment vas-tu aujourd'hui  <Name name={"ANNNOUUUKKKK"} /> ? </Text>
      
    </View>
    
  );
}

