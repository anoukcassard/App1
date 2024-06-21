import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Link} from 'expo-router';

const RendezvousAjout = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [practitioners, setPractitioners] = useState([]);

    useEffect(() => {
        // Fetch all practitioners on initial load
        fetchPractitioners();
    }, []);

    const fetchPractitioners = async () => {
        try {
            const snapshot = await firestore().collection('medecin').get();
            const practitionersList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPractitioners(practitionersList);
        } catch (error) {
            console.error('Error fetching practitioners: ', error);
        }
    };

    const handleSearch = async () => {
        try {
            const endQuery = searchQuery + '\uf8ff';
            const snapshot = await firestore()
                .collection('medecin')
                .where('nom', '>=', searchQuery)
                .where('nom', '<=', endQuery)
                .get();

            const searchResults = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            console.log('Search results:', searchResults);  // Log search results for debugging
            setPractitioners(searchResults);
        } catch (error) {
            console.error('Error searching practitioners:', error);
        }
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
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Link href={`/practitioner/${item.id}`}>
                    <View style={styles.listItem}>

                        <Text>{item.prenom} {item.nom}</Text>
                        <Text>{item.type}</Text>
                        <Text>{item.ville}</Text>
                    </View>
                        </Link>
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
