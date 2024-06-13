import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const MessagesAjout = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [practitioners, setPractitioners] = useState([
    { id: 1, name: 'Dr. John Doe' },
    { id: 2, name: 'Dr. Jane Smith' }
  ]);

  const handleSearch = () => {
    
    console.log('Recherche pour:', searchQuery);
    
    setPractitioners([{ id: 1, name: 'Dr. John Doe' }, { id: 2, name: 'Dr. Jane Smith' }]);
  };

  const handlePractitionerPress = (name: string) => {
    router.push(`/souspages/redactionmessage`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rechercher</Text>
      <Text style={styles.subtitle}>Nom, spécialité, établissement...</Text>
      <TextInput
        style={styles.input}
        placeholder="Rechercher un praticien"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Rechercher" onPress={handleSearch} />
      <Text style={styles.sectionTitle}>Mes praticiens</Text>
      <FlatList
        data={practitioners}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePractitionerPress(item.name)}>
            <View style={styles.listItem}>
              <Text>{item.name}</Text>
            </View>
            onPress={() => router.navigate('/redactionmessage')}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddf0ff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#187ecc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default MessagesAjout;
