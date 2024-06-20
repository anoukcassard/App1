import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Accueil = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(async (authenticatedUser) => {
            setUser(authenticatedUser);
            if (authenticatedUser) {
                const userDoc = await firestore().collection('users').doc(authenticatedUser.uid).get();
                setUserData(userDoc.data());
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    const greeting = () => {
        if (userData) {
            return userData.isDoctor ? `Bonjour Dr. ${userData.firstName} ${userData.lastName}` : `Bonjour Mr/Mme ${userData.firstName} ${userData.lastName}`;
        }
        return "Chargement...";
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontFamily: 'PlaywriteNZ-Regular', fontSize: 40, color: 'white' }}>Doctolib</Text>
                <Text style={styles.welcomeText}>{greeting()}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ddf0ff',
    },
    header: {
        backgroundColor: '#187ecc',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 32,  // Taille de police plus grande
        fontWeight: 'bold',},
    welcomeText: {
        fontSize: 18,
        color: 'white',
        marginVertical: 10,
    },
    infoBox: {
        margin: 20,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    infoText: {
        fontSize: 16,
        textAlign: 'center',
    },
    historySection: {
        padding: 20,
    },
    historyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    historyButtonText: {
        fontSize: 16,
        color: '#007BFF',
    },
});

export default Accueil;

