import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const Avenir = () => {
    const route = useRoute();
    const { appointment } = route.params;

    if (!appointment) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Aucun rendez-vous à afficher.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Résumé du Rendez-vous</Text>
            <Text style={styles.detail}>Médecin: {appointment.practitionerName}</Text>
            <Text style={styles.detail}>Date: {appointment.date}</Text>
            <Text style={styles.detail}>Heure: {appointment.time}</Text>
            {/* Ajoutez d'autres détails ici si nécessaire */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    detail: {
        fontSize: 18,
        marginBottom: 8,
    },
    message: {
        fontSize: 18,
        color: 'gray',
    },
});

export default Avenir;