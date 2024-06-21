import React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ExpoRouter } from 'expo-router/types/expo-router';
import { router } from 'expo-router';

// Définition des types des paramètres des routes
type RootStackParamList = {
  Rendezvous: undefined;
  RendezvousAjout: undefined;
};

const Tab = createMaterialTopTabNavigator();

const AvenirScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={{ flex: 1, backgroundColor: '#ddf0ff' }}>
      <Text>Contenu à venir</Text>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <MaterialCommunityIcons name="calendar" size={80} color="#187ecc" />
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
          Aucun rendez-vous à venir
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center' }}>
          Trouvez un praticien et prenez rendez-vous en ligne à tout moment.
        </Text>
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
          onPress={() => router.navigate('/rendezvousajout')}
        >
          <MaterialCommunityIcons name="magnify" size={20} color="white" />
          <Text style={{ color: 'white', fontSize: 16, marginLeft: 10 }}>
            Prendre rendez-vous
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PassesScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#ddf0ff' }}>
      <Text>Contenu passés</Text>
    </View>
  );
};

const RendezvousAjoutScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#ddf0ff' }}>
      <Text>Rechercher</Text>
      <Text>Nom, spécialité, établissement...</Text>
      <form>
        <input type="search" id="search-bar" placeholder="Rechercher un praticien" />
        <button type="submit">Rechercher</button>
      </form>
      <h2>Mes praticiens</h2>
      <ul id="praticiens-list">
      </ul>
    </View>
  );
};

const RendezvousTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Avenir"
        component={AvenirScreen}
        options={{
          tabBarLabel: 'A venir',
        }}
      />
      <Tab.Screen
        name="Passés"
        component={PassesScreen}
        options={{
          tabBarLabel: 'Passés',
        }}
      />
    </Tab.Navigator>
  );
};

export default function Rendezvous() {
  return (
    <RendezvousTab />
  );
}
