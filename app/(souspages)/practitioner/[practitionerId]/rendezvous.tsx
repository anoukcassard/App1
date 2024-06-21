import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Alert, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import {useGlobalSearchParams, useLocalSearchParams, useRouter} from "expo-router";

const generateTimeSlots = (start, end, interval) => {
    const times = [];
    let current = start;

    while (current < end) {
        const hours = Math.floor(current / 60);
        const minutes = current % 60;
        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        times.push(formattedTime);
        current += interval;
    }

    return times;
};

const DynamicCalendar = () => {
    const { practitionerId } = useLocalSearchParams();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [practitionerName, setPractitionerName] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!practitionerId) {
            Alert.alert('Erreur', 'ID du praticien non défini.');
            return;
        }

        setLoading(false)

        const fetchPractitioner = async () => {
            try {
                const response = await fetch(`https://votre-api.com/practitioners/${practitionerId}`);
                const data = await response.json();
                setPractitionerName(data.name);
                setLoading(false);
            } catch (error) {
                console.error(error);
                Alert.alert('Erreur', 'Impossible de récupérer les informations du praticien.');
                setLoading(false);
            }
        };

        // fetchPractitioner();
    }, [practitionerId]);

    const onDayPress = (day) => {
        setSelectedDate(day.dateString);
        setSelectedTimeSlot('');
    };

    const handleConfirm = () => {
        if (selectedDate && selectedTimeSlot) {
            Alert.alert(
                'Rendez-vous confirmé',
                `Votre rendez-vous avec le docteur ${practitionerName} a été confirmé.\nDate: ${selectedDate}\nCréneau horaire: ${selectedTimeSlot}`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            router.navigate('../../../(tabs)/rendezvous', {
                                params: {
                                    appointment: {
                                        practitionerName,
                                        date: selectedDate,
                                        time: selectedTimeSlot,
                                        // Add other details if needed (e.g., address, city)
                                    },
                                },
                            })
                        },
                    },
                ]
            );
        } else {
            Alert.alert('Erreur', 'Veuillez sélectionner une date et un créneau horaire.');
        }
    };

    const timeSlots = generateTimeSlots(9 * 60, 17 * 60, 20);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Calendrier Dynamique</Text>
            <Calendar
                onDayPress={onDayPress}
                markedDates={{
                    [selectedDate]: {
                        selected: true,
                        marked: true,
                        selectedColor: 'blue',
                    },
                }}
                theme={{
                    selectedDayBackgroundColor: 'blue',
                    todayTextColor: 'red',
                    arrowColor: 'blue',
                }}
            />
            {selectedDate ? (
                <>
                    <Text style={styles.selectedDateText}>
                        Date sélectionnée: {selectedDate}
                    </Text>
                    <Text style={styles.label}>Sélectionnez un créneau horaire:</Text>
                    <RNPicker
                        selectedValue={selectedTimeSlot}
                        onValueChange={(itemValue) => setSelectedTimeSlot(itemValue)}
                        style={styles.picker}
                    >
                        <RNPicker.Item label="Choisir un créneau horaire" value="" />
                        {timeSlots.map((time) => (
                            <RNPicker.Item key={time} label={time} value={time} />
                        ))}
                    </RNPicker>
                    <Button title="Confirmer le rendez-vous" onPress={handleConfirm} />
                </>
            ) : (
                <Text style={styles.selectedDateText}>
                    Aucune date sélectionnée
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    selectedDateText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 16,
    },
    label: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 16,
    },
    picker: {
        height: 50,
        width: '100%',
        marginTop: 16,
    },
});

export default DynamicCalendar;
