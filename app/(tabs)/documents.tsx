// Documents.js
import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


const Tab = createMaterialTopTabNavigator();

const DocumentsScreen = () => {
  return (
    <><View>
      <Text>Contenu des documents</Text>
    </View>
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
        >
          <MaterialCommunityIcons name="plus" size={20} color="white" />
          <Text style={{ color: 'white', fontSize: 16, marginLeft: 10 }}>
            Ajouter un document
          </Text>
        </TouchableOpacity>
      </View>
      <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons name="file-document" size={80} color="#187ecc" />
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        Échanger des documents avec vos praticiens
      </Text>
      <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 20, textAlign: 'center' }}>
        Prenez des notes personnelles pour vous souvenir des informations importantes.
        Vous êtes la seule personne à y avoir accès grâce au chiffrement.
      </Text>
    </View></>
  );
};

const NotesScreen = () => {
  return (
    <>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <MaterialCommunityIcons name="note" size={80} color="#187ecc" />
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
          CRÉER DES NOTES
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 20, textAlign: 'center' }}>
          Prenez des notes personnelles pour vous souvenir des informations importantes.
          Vous êtes la seule personne à y avoir accès grâce au chiffrement.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#187ecc',
            borderRadius: 20,
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MaterialCommunityIcons name="note-plus" size={20} color="white" />
          <Text style={{ color: 'white', fontSize: 16, marginLeft: 10, fontWeight: 'bold' }}>
            CRÉER UNE NOTE
          </Text>
        </TouchableOpacity>
      </View></>
      );
    }

export default function Documents() {
  return (
    <><Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{
          tabBarLabel: 'Documents',
        }} />
      <Tab.Screen
        name="Notes"
        component={NotesScreen}
        options={{
          tabBarLabel: 'Notes',
        }} />
    </Tab.Navigator>
    </>
  );
}