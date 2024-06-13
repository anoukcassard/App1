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
        }}
       />
        {/* <Stack.Screen
        name="index"
       options={{ headerShown: false }}
       /> */}
      {/* <Stack.Screen
        name="messages/[practitionerName]"
        options={{ title: 'Rédaction du Message' }}
      /> */}
    </Stack>
  );
}
