
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text } from "react-native";
import { router } from 'expo-router';

export default function Messages() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons name="email-open" size={50} color="#187ecc" />
      <Text style={{ fontWeight: "bold", fontSize: 24 }}>
        Envoyer des messages à des praticiens
      </Text>
      <Text style={{ fontSize: 16 }}>
        Echangez des messages avec vos praticiens. Posez une question sur des résultats
        d'examen, demandez une lettre d'adressage, et plus encore.
      </Text>
      <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#187ecc',
            borderRadius: 30, 
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => router.navigate('/envoimessage')}
        >
          <MaterialCommunityIcons name="message-draw" size={20} color="white" />
          <Text style={{ color: 'white', fontSize: 16, marginLeft: 10 }}>
            Envoyer un message
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
