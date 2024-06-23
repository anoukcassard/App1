import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AvenirScreen from '../(souspages)/avenir';
import PassesScreen from '../(souspages)/passes';
import RendezvousAjout from '../(souspages)/rendezvousajout';
import PrendreRendezvous from '../(souspages)/PrendreRendezvous';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

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
