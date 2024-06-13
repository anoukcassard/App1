import Name from '@/components/Name';
import { Link } from 'expo-router';

import { Text, View } from "react-native";


export default function Documents() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      
      <Text>Bienvenu dans l'ecran documents<Name name={"Anouk"}/></Text>
    </View>
    
  );
}