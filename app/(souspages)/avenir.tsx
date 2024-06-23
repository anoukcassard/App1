import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const AvenirScreen = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const user = auth().currentUser;
        if (!user) {
            return;
        }

        const unsubscribe = firestore()
            .collection('appointments')
            .where('patientId', '==', user.uid)
            .where('date', '>=', new Date().toISOString()) // Only fetch upcoming appointments
            .orderBy('date', 'asc')
            .onSnapshot(snapshot => {
                const fetchedAppointments = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAppointments(fetchedAppointments);
                setLoading(false);
            }, error => {
                console.error("Error fetching appointments: ", error);
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
                        <MaterialCommunityIcons name="calendar" size={80} color="#187ecc" />
                        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
                            Aucun rendez-vous à venir
                        </Text>
                        <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center' }}>
                            Trouvez un praticien et prenez rendez-vous en ligne à tout moment.
                        </Text>
                    </View>
                )}
            />
            <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#187ecc',
                        borderRadius: 30,
                        padding: 10,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => navigation.navigate('RendezvousAjout')}
                >
                    <MaterialCommunityIcons name="magnify" size={20} color="white" />
                    <Text style={{ color: 'white', fontSize: 16, marginLeft: 10 }}>
                        Prendre rendez-vous
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    appointmentItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    appointmentText: {
        fontSize: 18,
    },
});

export default AvenirScreen;
