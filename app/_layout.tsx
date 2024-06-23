import { Stack } from 'expo-router';
import React from 'react';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();

    const getTitle = (routeName: string | undefined) => {
        switch (routeName) {
            case 'accueil':
                return 'Mes Accueil';
            case 'rendezvous':
                return 'Mes Rendez-vous';
            case 'documents':
                return 'Mes Documents';
            case 'messages':
                return 'Mes Messages';
            case 'comptes':
                return 'Mes Comptes';
            case 'UserProfile':
                return 'Profil Utilisateur';
            case 'envoimessage':
                return 'Envoyer un Message';
            case 'PrendreRendezvous':
                return 'Prendre Rendez-vous';
            default:
                return 'Doctolib';
        }
    };

    const routeName = router?.route?.name;

    return (
        <Stack>
            <Stack.Screen
                name="(tabs)"
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#187ecc',
                    },
                    title: getTitle(routeName),
                    headerTintColor: "#FFF",
                    headerTitleStyle: {
                        fontFamily: "PlaywriteNZ-Regular",
                        // fontWeight: "400",
                    }
                }}
            />
            <Stack.Screen
                name="(souspages)/UserProfile"
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#187ecc',
                    },
                    title: getTitle(routeName),
                }}
            />
            <Stack.Screen
                name="(souspages)/envoimessage"
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#187ecc',
                    },
                    title: getTitle(routeName),
                }}
            />
            <Stack.Screen
                name="(souspages)/PrendreRendezvous"
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#187ecc',
                    },
                    title: getTitle(routeName),
                }}
            />
        </Stack>
    );
}
