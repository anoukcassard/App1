import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

const RedactionMessage = () => {
  const router = useRouter();
  const practitionerName = router.query?.practitionerName;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Rédaction du message pour {practitionerName}</Text>
    </View>
  );
};

export default RedactionMessage;
