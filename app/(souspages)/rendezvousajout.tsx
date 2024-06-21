import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const RendezvousAjout = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [practitioners, setPractitioners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        fetchPractitioners();
    }, []);

    const fetchPractitioners = async () => {
        try {
            setLoading(true);
            const snapshot = await firestore().collection('users')
                .where('isDoctor', '==', true)
                .get();
            const practitionersList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log('Fetched practitioners:', practitionersList); // Debug log
            setPractitioners(practitionersList);
        } catch (error) {
            console.error('Error fetching practitioners: ', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const endQuery = searchQuery + '\uf8ff';
            const snapshot = await firestore()
                .collection('users')
                .where('isDoctor', '==', true)
                .where('lastName', '>=', searchQuery)
                .where('lastName', '<=', endQuery)
                .get();

            const searchResults = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            console.log('Search results:', searchResults); // Debug log
            setPractitioners(searchResults);
        } catch (error) {
            console.error('Error searching practitioners:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('PrendreRendezvous', { doctor: item })}>
            <Text>{item.firstName} {item.lastName}</Text>
            <Text>{item.phoneNumber}</Text>
            <Text>{item.email}</Text>
            {/* Ajoutez d'autres champs si nécessaire */}
        </TouchableOpacity>
    );

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
            {error && <Text style={styles.errorText}>Une erreur est survenue : {error.message}</Text>}
            {loading && <Text>Chargement...</Text>}
            <Text style={styles.sectionTitle}>Mes praticiens</Text>
            <FlatList
                data={practitioners}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
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
    errorText: {
        color: 'red',
        marginBottom: 20,
    },
});

export default RendezvousAjout;
