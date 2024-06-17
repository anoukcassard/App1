import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth().currentUser;
            if (user) {
                const userDoc = await firestore().collection('users').doc(user.uid).get();
                setUserData(userDoc.data());
            }
        };

        fetchUserData();
    }, []);

    if (!userData) {
        return (
            <View style={styles.container}>
                <Text>Chargement...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profil de l'utilisateur</Text>
            <Text>Prénom: {userData.firstName}</Text>
            <Text>Nom: {userData.lastName}</Text>
            <Text>Email: {userData.email}</Text>
            <Text>Numéro de téléphone: {userData.phoneNumber}</Text>
            <Text>Date de naissance: {userData.birthDate}</Text>
            <Text>Numéro de sécurité sociale: {userData.ssn}</Text>
            <Text>Médecin: {userData.isDoctor ? 'Oui' : 'Non'}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default UserProfile;
