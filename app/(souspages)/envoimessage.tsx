import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';

const EnvoiMessage = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      const patientsCollection = await firestore().collection('users').where('isDoctor', '==', false).get();
      const patientsList = patientsCollection.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(patientsList);
      setFilteredPatients(patientsList);
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter(patient =>
        patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  const handleSendMessage = async () => {
    const user = auth().currentUser;
    if (!user || !selectedPatient) return;

    try {
      const existingConversations = await firestore()
          .collection('conversations')
          .where('doctorId', '==', user.uid)
          .where('patientId', '==', selectedPatient.id)
          .get();

      let conversationRef;
      if (existingConversations.empty) {
        conversationRef = firestore().collection('conversations').doc();
        await conversationRef.set({
          doctorId: user.uid,
          patientId: selectedPatient.id,
          isOpen: true,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      } else {
        conversationRef = existingConversations.docs[0].ref;
      }

      await conversationRef.collection('messages').add({
        senderId: user.uid,
        text: message,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      setMessage('');
      setSelectedPatient(null);
      setSearchQuery('');
      router.push('/messages'); // Use router.push to navigate back to the messages screen after sending the message
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Envoyer un message</Text>
        <TextInput
            style={styles.input}
            placeholder="Rechercher un patient"
            value={searchQuery}
            onChangeText={setSearchQuery}
        />
        <FlatList
            data={filteredPatients}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setSelectedPatient(item)}>
                  <Text style={selectedPatient?.id === item.id ? styles.selected : styles.item}>
                    {item.firstName} {item.lastName}
                  </Text>
                </TouchableOpacity>
            )}
        />
        {selectedPatient && (
            <>
              <TextInput
                  style={styles.input}
                  placeholder="Votre message"
                  value={message}
                  onChangeText={setMessage}
              />
              <Button title="Envoyer" onPress={handleSendMessage} />
            </>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selected: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#d3d3d3',
  },
});

export default EnvoiMessage;
