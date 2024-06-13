import Name from '@/components/Name';
import { Link } from 'expo-router';

import { Text, View } from "react-native";


export default function Avenirpasses() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      
      <Text>Bienvenu dans l'ecran passes<Name name={"Anouk"}/></Text>
    </View>
  );
}