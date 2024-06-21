import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TouchableOpacity} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


import {Link} from "expo-router";

export default function Accueil() {
    const { practitionerId } = useLocalSearchParams();
    const [practitioner, setPractitioner] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPractitioner = async () => {
            try {
                const doc = await firestore().collection('medecin').doc(practitionerId).get();
                if (doc.exists) {
                    setPractitioner(doc.data());
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching practitioner: ', error);
            }
        };

        if (practitionerId) {
            fetchPractitioner();
        }
    }, [practitionerId]);

    const handleAppointment = () => {
        // Navigate to the appointment page with the practitionerId
        router.push(`/appointment/${practitionerId}`);
    };

    if (!practitioner) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#187ecc" />
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
        );
    }


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{practitioner.prenom} {practitioner.nom}</Text>
                <View style={styles.separator} />
                <Text style={styles.text}><Text style={styles.label}>Spécialité:</Text> {practitioner.type}</Text>
                <Text style={styles.text}><Text style={styles.label}>Numéro:</Text> {practitioner.num}</Text>
                <Text style={styles.text}><Text style={styles.label}>Email:</Text> {practitioner.email}</Text>
                <Text style={styles.text}><Text style={styles.label}>Cabinet:</Text> {practitioner.cabinet}</Text>
                <Text style={styles.text}><Text style={styles.label}>Adresse:</Text> {practitioner.adresse} {practitioner.ville}</Text>
                <View >

                    <TouchableOpacity
                        style={{
                            backgroundColor: '#187ecc',
                            borderRadius: 10,
                            padding: 10,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => router.navigate(`/practitioner/${practitionerId}/rendezvous`)}
                    >
                        <Text style={{ color: 'white', fontSize: 16, marginLeft: 10 }}>
                            Prendre rendez-vous avec ce practitien
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f4f7',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        width: '100%',
        maxWidth: 400,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#187ecc',
        marginBottom: 10,
        textAlign: 'center',
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
    },
    label: {
        fontWeight: 'bold',
        color: '#187ecc',
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f7',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: '#333',
    },
    buttonContainer: {
        marginTop: 20,
        borderRadius: 10,
        overflow: 'hidden',
    },
});
