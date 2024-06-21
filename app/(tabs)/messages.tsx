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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribeAuth = auth().onAuthStateChanged(user => {
            if (user) {
                setIsAuthenticated(true);
                fetchUserData(user.uid);
            } else {
                setIsAuthenticated(false);
                resetState();
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const fetchUserData = async (userId) => {
        const userDoc = await firestore().collection('users').doc(userId).get();
        if (userDoc.exists) {
            setIsDoctor(userDoc.data().isDoctor);
            fetchConversations(userId, userDoc.data().isDoctor);
        }
    };

    const fetchConversations = async (userId, isDoctor) => {
        let conversationsQuery = firestore().collection('conversations');

        if (isDoctor) {
            conversationsQuery = conversationsQuery.where('doctorId', '==', userId);
        } else {
            conversationsQuery = conversationsQuery.where('patientId', '==', userId);
        }

        const unsubscribeConversations = conversationsQuery.onSnapshot(async snapshot => {
            const conversationsList = await Promise.all(snapshot.docs.map(async doc => {
                const data = doc.data();
                const userDoc = await firestore().collection('users').doc(isDoctor ? data.patientId : data.doctorId).get();
                const userData = userDoc.data();
                return {
                    id: doc.id,
                    ...data,
                    userName: `${userData.firstName} ${userData.lastName}`,
                };
            }));

            console.log('Conversations fetched:', conversationsList);
            setConversations(conversationsList);
            setLoading(false);
        }, error => {
            console.error('Error fetching conversations:', error);
        });

        return () => unsubscribeConversations();
    };

    useEffect(() => {
        if (!selectedConversation) return;

        console.log('Fetching messages for conversation:', selectedConversation.id);

        const unsubscribeMessages = firestore()
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

        return () => unsubscribeMessages();
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

    const resetState = () => {
        setConversations([]);
        setSelectedConversation(null);
        setMessages([]);
        setIsDoctor(false);
        setLoading(true);
    };

    if (!isAuthenticated) {
        return (
            <View style={styles.container}>
                <Text>Vous n'êtes pas connectés</Text>
                <Button title="Se connecter" onPress={() => router.push('(souspages)/login_form')} />
            </View>
        );
    }

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
                            Conversation avec {item.userName}
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
                                <Text>{item.senderId === auth().currentUser.uid ? 'Moi' : 'Autre'}: {item.text}</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
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
