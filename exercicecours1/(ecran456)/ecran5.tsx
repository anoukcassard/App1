import Name from '@/components/Name';
import { Link } from 'expo-router';

import { Text, View } from "react-native";


export default function Ecran4() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href={"/ecran4"}>Ecran4</Link>
      <Link href={"/ecran6"}>Ecran6</Link>
      <Text>Bienvenu dans l'ecran 5<Name name={"Anouk"}/></Text>
    </View>
  );
}