import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const PassesScreen = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth().currentUser;
        if (!user) {
            return;
        }

        const unsubscribe = firestore()
            .collection('appointments')
            .where('patientId', '==', user.uid)
            .where('date', '<', new Date().toISOString()) // Only fetch past appointments
            .orderBy('date', 'desc')
            .onSnapshot(snapshot => {
                const fetchedAppointments = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAppointments(fetchedAppointments);
                setLoading(false);
            }, error => {
                console.error("Error fetching past appointments: ", error);
                setLoading(false);
            });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#187ecc" />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#ddf0ff' }}>
            <FlatList
                data={appointments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.appointmentItem}>
                        <Text style={styles.appointmentText}>
                            Rendez-vous avec le Dr. {item.doctorName} le {new Date(item.date).toLocaleString()}
                        </Text>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <MaterialCommunityIcons name="calendar-remove" size={80} color="#187ecc" />
                        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
                            Aucun rendez-vous passé
                        </Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    appointmentItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#fff',
    },
    appointmentText: {
        fontSize: 18,
    },
});

export default PassesScreen;
