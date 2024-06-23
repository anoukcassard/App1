import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [isDoctor, setIsDoctor] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchUserData = async (userId) => {
            try {
                const userDoc = await firestore().collection('users').doc(userId).get();
                if (userDoc.exists) {
                    setIsDoctor(userDoc.data().isDoctor);
                    fetchConversations(userId, userDoc.data().isDoctor);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError(error);
                setLoading(false);
            }
        };

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

    useEffect(() => {
        if (!selectedConversation) return;

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
                setError(error);
            });

        return () => unsubscribeMessages();
    }, [selectedConversation]);

    const resetState = () => {
        setConversations([]);
        setMessages([]);
        setSelectedConversation(null);
        setNewMessage('');
        setIsDoctor(false);
        setLoading(false);
    };

    const fetchConversations = async (userId, isDoctor) => {
        try {
            setLoading(true);
            const query = firestore()
                .collection('conversations')
                .where(isDoctor ? 'doctorId' : 'patientId', '==', userId)
                .where('isOpen', '==', true);

            const snapshot = await query.get();
            const conversationsList = await Promise.all(snapshot.docs.map(async (doc) => {
                const data = doc.data();
                const otherUserId = isDoctor ? data.patientId : data.doctorId;
                const userDoc = await firestore().collection('users').doc(otherUserId).get();
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
        } catch (error) {
            console.error('Error fetching conversations:', error);
            setError(error);
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            await firestore()
                .collection('conversations')
                .doc(selectedConversation.id)
                .collection('messages')
                .add({
                    text: newMessage,
                    senderId: auth().currentUser.uid,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Error', 'An error occurred while sending the message');
        }
    };

    const renderConversationItem = ({ item }) => (
        <TouchableOpacity style={styles.conversationItem} onPress={() => setSelectedConversation(item)}>
            <Text style={styles.conversationText}>
                Conversation with {item.userName}
            </Text>
        </TouchableOpacity>
    );

    const renderMessageItem = ({ item }) => {
        const isCurrentUser = item.senderId === auth().currentUser.uid;
        return (
            <View style={[styles.messageItem, isCurrentUser ? styles.messageItemRight : styles.messageItemLeft]}>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.messageDate}>{item.createdAt?.toDate().toLocaleString()}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {error && <Text style={styles.errorText}>Une erreur est survenue : {error.message}</Text>}
            {loading ? <ActivityIndicator size="large" color="#187ecc" /> : (
                <>
                    {isDoctor && (
                        <TouchableOpacity style={styles.searchButton} onPress={() => /* navigate to search screen */ { }}>
                            <Text style={styles.searchButtonText}>Chercher un patient</Text>
                        </TouchableOpacity>
                    )}
                    <FlatList
                        data={conversations}
                        keyExtractor={(item) => item.id}
                        renderItem={renderConversationItem}
                        contentContainerStyle={styles.conversationList}
                    />
                    {selectedConversation && (
                        <>
                            <FlatList
                                data={messages}
                                keyExtractor={(item) => item.id}
                                renderItem={renderMessageItem}
                                contentContainerStyle={styles.messageList}
                            />
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={newMessage}
                                    onChangeText={setNewMessage}
                                    placeholder="Type a message"
                                />
                                <Button title="Send" onPress={handleSendMessage} />
                            </View>
                        </>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    errorText: { color: 'red', marginBottom: 20 },
    searchButton: { marginBottom: 10, padding: 10, backgroundColor: '#187ecc', borderRadius: 5 },
    searchButtonText: { color: 'white', textAlign: 'center' },
    conversationList: { marginBottom: 20 },
    conversationItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    conversationText: { fontSize: 16 },
    messageList: { marginBottom: 20 },
    messageItem: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        maxWidth: '80%',
    },
    messageItemLeft: {
        alignSelf: 'flex-start',
        backgroundColor: '#acacac',
    },
    messageItemRight: {
        alignSelf: 'flex-end',
        backgroundColor: '#187ecc',
    },
    messageText: { fontSize: 16, color: 'white' },
    messageDate: { fontSize: 12, color: 'lightgray' },
    inputContainer: { flexDirection: 'row', alignItems: 'center' },
    input: { flex: 1, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, padding: 10, marginRight: 10 },
});

export default Messages;
