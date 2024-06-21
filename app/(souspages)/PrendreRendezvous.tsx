import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';

const PrendreRendezvous = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { doctor } = route.params;

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const handleBooking = async () => {
        if (!date || !time) {
            Alert.alert('Erreur', 'Veuillez renseigner la date et l\'heure.');
            return;
        }

        try {
            await firestore().collection('rendezvous').add({
                doctorId: doctor.id,
                date,
                time,
                patientId: 'CURRENT_USER_ID', // Remplacez par l'ID de l'utilisateur actuel
            });
            Alert.alert('Succès', 'Votre rendez-vous a été pris avec succès.');
            navigation.goBack();
        } catch (error) {
            console.error('Error booking appointment: ', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la prise de rendez-vous.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Prendre Rendez-vous avec {doctor.firstName} {doctor.lastName}</Text>
            <TextInput
                style={styles.input}
                placeholder="Date (YYYY-MM-DD)"
                value={date}
                onChangeText={setDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Heure (HH:MM)"
                value={time}
                onChangeText={setTime}
            />
            <Button title="Prendre Rendez-vous" onPress={handleBooking} />
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
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#187ecc',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
});

export default PrendreRendezvous;
