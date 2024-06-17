import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Comptes from './app/(tabs)/comptes';
import UserProfile from './app/(souspages)/UserProfile';

const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Comptes">
                <Stack.Screen name="Comptes" component={Comptes} />
                <Stack.Screen name="UserProfile" component={UserProfile} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
