import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const PrendreRendezvous = ({ route, navigation }) => {
    const { doctor } = route.params;
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    const handleTimeChange = (event, selectedDate) => {
        const currentTime = selectedDate || date;
        setShowTimePicker(false);
        setDate(currentTime);
    };

    const handleSave = async () => {
        try {
            const user = auth().currentUser;
            if (!user) {
                navigation.navigate('Login', {
                    redirectTo: 'PrendreRendezvous',
                    params: { doctor }
                });
                return;
            }

            const patientId = user.uid;

            await firestore()
                .collection('appointments')
                .add({
                    doctorId: doctor.id,
                    patientId: patientId,
                    date: date.toISOString(),
                    status: 'pending',
                });

            alert('Rendez-vous pris avec succès!');
            navigation.goBack();
        } catch (error) {
            console.error("Error adding appointment: ", error);
            alert('Erreur lors de la prise de rendez-vous. Veuillez réessayer.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Prendre Rendez-vous avec {doctor.firstName} {doctor.lastName}</Text>
            <Text style={styles.label}>Sélectionnez la date</Text>
            <Button title="Choisir la date" onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
            <Text style={styles.label}>Sélectionnez l'heure</Text>
            <Button title="Choisir l'heure" onPress={() => setShowTimePicker(true)} />
            {showTimePicker && (
                <DateTimePicker
                    value={date}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}
            <Text style={styles.selectedDate}>Date et Heure sélectionnées: {date.toLocaleString()}</Text>
            <Button title="Enregistrer" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    selectedDate: {
        fontSize: 16,
        marginTop: 20,
        marginBottom: 20,
    },
});

export default PrendreRendezvous;
