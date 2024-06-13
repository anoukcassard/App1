import Name from '@/components/Name';
import { Link } from 'expo-router';

import { Text, View } from "react-native";


export default function Ecran2() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href={"/ecran4"}>Ecran4</Link>
      <Link href={"/ecran5"}>Ecran5</Link>
      <Text>Bienvenu dans l'ecran 2 <Name name={"Anouk"}/></Text>
    </View>
  );
}