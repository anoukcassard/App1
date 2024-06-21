import React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import RendezvousAjout from '../(souspages)/rendezvousajout';
import PrendreRendezvous from '../(souspages)/PrendreRendezvous';
import { useRouter } from 'expo-router';

// Définition des types des paramètres des routes
type RootStackParamList = {
    Rendezvous: undefined;
    RendezvousAjout: undefined;
    PrendreRendezvous: { doctor: any };
};

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const AvenirScreen = () => {
    const router = useRouter();
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
                    onPress={() => router.push('/rendezvousajout')}
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

const AppNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Rendezvous" component={RendezvousTab} />
            <Stack.Screen name="RendezvousAjout" component={RendezvousAjout} />
            <Stack.Screen name="PrendreRendezvous" component={PrendreRendezvous} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
