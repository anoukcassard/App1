import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { router } from "expo-router";

const Accueil = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(async (authenticatedUser) => {
            setUser(authenticatedUser);
            if (authenticatedUser) {
                const userDoc = await firestore().collection('users').doc(authenticatedUser.uid).get();
                setUserData(userDoc.data());
            } else {
                setUserData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const greeting = () => {
        if (userData) {
            return userData.isDoctor ? `Dr. ${userData.firstName ?? ''} ${userData.lastName ?? ''}` : `Mr/Mme ${userData.firstName ?? ''} ${userData.lastName ?? ''}`;
        }
        return "Veuillez vous connecter...";
    };

    if (!user) {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 40, color: 'white' }}>Bonjour</Text>
                    <Text style={styles.welcomeText}>Veuillez vous connecter...</Text>
                </View>
                <View style={styles.promoContainer}>
                    <Text style={styles.promoText}>
                       Pour plus de fonctionnalités veuillez vous connectez
                    </Text>
                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => router.replace('/comptes')}
                    >
                        <Text style={styles.linkText}>Se connecter / S'inscrire</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={{fontSize: 40, color: 'white' }}>Bonjour</Text>
                <Text style={styles.welcomeText}>{greeting()}</Text>
            </View>
            {userData && (
                <View style={styles.notificationContainer}>
                    <Text style={styles.notificationText}>
                        {userData.isDoctor ? "Vous avez 3 nouveaux messages de patients." : "Vous avez des nouveaux messages de votre médecin"}
                    </Text>
                </View>
            )}
            {userData && !userData.isDoctor && (
                <View style={styles.promoContainer}>
                    <Text style={styles.promoText}>
                        Vous êtes praticien ? Équipez-vous du logiciel Doctolib pour gagner en confort de travail.
                    </Text>
                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => router.replace('/comptes')}
                    >
                        <Text style={styles.linkText}>Connectez-vous en tant que docteur</Text>
                    </TouchableOpacity>
                </View>
            )}
            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Dernières Nouvelles</Text>
                <Text style={styles.infoContent}>Découvrez les dernières avancées en médecine générale...</Text>
            </View>
            <View style={styles.statsContainer}>
                <Text style={styles.statsHeader}>Votre Récapitulatif Hebdomadaire</Text>
                <View style={styles.statsBox}>
                    <Text style={styles.statsNumber}>12</Text>
                    <Text style={styles.statsLabel}>Patients Consultés</Text>
                </View>
                <View style={styles.statsBox}>
                    <Text style={styles.statsNumber}>3</Text>
                    <Text style={styles.statsLabel}>Rendez-vous Manqués</Text>
                </View>
                <View style={styles.statsBox}>
                    <Text style={styles.statsNumber}>15</Text>
                    <Text style={styles.statsLabel}>Rendez-vous Prévus</Text>
                </View>
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
    welcomeText: {
        fontSize: 18,
        color: 'white',
        marginVertical: 10,
    },
    promoContainer: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 10,
    },
    promoText: {
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
        marginBottom: 20,
    },
    linkButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    linkText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
    notificationContainer: {
        backgroundColor: '#f8d7da',
        padding: 10,
        borderRadius: 5,
    },
    notificationText: {
        color: '#721c24',
        textAlign: 'center',
    },
    infoSection: {
        padding: 15,
        backgroundColor: '#e2e3e5',
        borderRadius: 5,
        marginVertical: 10,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    infoContent: {
        fontSize: 14,
        color: '#666',
    },
    statsContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        marginBottom: 20,
    },
    statsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    statsBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#f7f7f7',
        marginBottom: 10,
        borderRadius: 5,
    },
    statsNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#187ecc',
    },
    statsLabel: {
        fontSize: 14,
        color: '#666',
    },
});

export default Accueil;
