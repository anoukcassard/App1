import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDoctor, setIsDoctor] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth().currentUser;
            if (!user) {
                console.log('No user is logged in');
                return;
            }

            const userDoc = await firestore().collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                setIsDoctor(userDoc.data().isDoctor);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const user = auth().currentUser;
        if (!user) {
            console.log('No user is logged in');
            return;
        }

        console.log('Fetching conversations for user:', user.uid);

        const unsubscribe = firestore()
            .collection('conversations')
            .where('doctorId', '==', user.uid)
            .onSnapshot(snapshot => {
                const conversationsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log('Conversations fetched:', conversationsList);
                setConversations(conversationsList);
                setLoading(false);
            }, error => {
                console.error('Error fetching conversations:', error);
            });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!selectedConversation) return;

        console.log('Fetching messages for conversation:', selectedConversation.id);

        const unsubscribe = firestore()
            .collection('conversations')
            .doc(selectedConversation.id)
            .collection('messages')
            .orderBy('createdAt', 'asc')
            .onSnapshot(snapshot => {
                const messagesList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log('Messages fetched:', messagesList);
                setMessages(messagesList);
            }, error => {
                console.error('Error fetching messages:', error);
            });

        return () => unsubscribe();
    }, [selectedConversation]);

    const handleSendMessage = async () => {
        const user = auth().currentUser;
        if (!user || !selectedConversation) return;

        console.log('Sending message:', message);

        try {
            await firestore()
                .collection('conversations')
                .doc(selectedConversation.id)
                .collection('messages')
                .add({
                    senderId: user.uid,
                    text: message,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });

            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Chargement...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Messages</Text>
            {isDoctor && (
                <Button title="Rechercher un patient" onPress={() => router.push('(souspages)/envoimessage')} />
            )}
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => setSelectedConversation(item)}>
                        <Text style={selectedConversation?.id === item.id ? styles.selected : styles.item}>
                            Conversation avec {item.patientId}
                        </Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text>Aucune conversation en cours.</Text>}
            />
            {selectedConversation && (
                <>
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.messageItem}>
                                <Text>{item.senderId === auth().currentUser.uid ? 'Moi' : 'Patient'}: {item.text}</Text>
                            </View>
                        )}
                    />
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
    input: {
        height: 40,
        borderColor: '#187ecc',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    messageItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default Messages;
