import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const RendezvousAjout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [practitioners, setPractitioners] = useState([]);

  // useEffect(()=>{
  //   const subscriber= firestore()
  //   .collection("medecin")
  //   .onSnapshot((querySnapshot) => {
  //     const medecin: any[] = [];
  //     querySnapshot.forEach((documentSnapshot)=>{
  //       medecins.push({
  //         ... documentSnapshot.data(),
  //         key: documentSnapshot.id,
  //       });
  //     });
  //     setMedecins(medecins);
  //     setloading(false);
  //   });
  //   return () => subscriber();
  // });


  const handleSearch = async () => {


    const medecin = await firestore()
      .collection('medecin')
      .get();
    console.log('Recherche pour:', medecin);
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
          <View style={styles.listItem}>
            <Text>{item.name}</Text>
          </View>
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

export default RendezvousAjout;
function setMedecins(medecins: any) {
  throw new Error('Function not implemented.');
}

