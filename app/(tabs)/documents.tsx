import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Linking, Alert, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import * as FileSystem from 'expo-file-system';
import firestore from '@react-native-firebase/firestore';
import { ScrollView, ActivityIndicator } from 'react-native';

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    documentList: { width: '100%' },
    documentRow: { marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, flexDirection: 'row', alignItems: 'center' },
    documentName: { fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    addButtonContainer: {
        backgroundColor: '#187ecc',
        borderRadius: 20,
        padding: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 20,
    },
});

const DocumentsScreen = () => {
    const [documents, setDocuments] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(async (user) => {
            if (user) {
                const userId = user.uid;
                const userRef = firestore().collection('users').doc(userId);
                try {
                    const userData = await userRef.get();
                    if (userData.exists) {
                        setCurrentUser(userData.data());
                        loadDocuments(userData.data());
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setError(error);
                }
            } else {
                setCurrentUser(null);
                setDocuments([]);  // Clear documents if no user is logged in
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const loadDocuments = (user) => {
        let query;
        if (user.isDoctor) {
            query = firestore().collection('documents');
        } else {
            query = firestore().collection('documents').where('email', '==', user.email);
        }

        const unsubscribeDocs = query.onSnapshot(snapshot => {
            const updatedDocuments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDocuments(updatedDocuments);
            setLoading(false);
        }, error => {
            console.error("Error getting documents:", error);
            setError(error);
            setLoading(false);
        });

        return unsubscribeDocs;
    };

    const pickDocument = async () => {
        if (!currentUser) {
            Alert.alert('Error', 'Please log in first');
            return;
        }

        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
            });

            if (!result.cancelled) {
                const document = result;
                const { firstName, lastName } = currentUser || {
                    firstName: 'Anonyme',
                    lastName: '',
                };
                let sender = `${firstName} ${lastName}`;
                const downloadUrl = await uploadDocument(document.uri, document.name, sender, currentUser.email);

                loadDocuments(currentUser);

                console.log('File available at:', downloadUrl);
            } else {
                console.log('No document selected');
                Alert.alert('Error', 'No document selected');
            }
        } catch (error) {
            console.error('Document picking error:', error);
            Alert.alert('Error', 'An error occurred while picking the document');
        }
    };

    const uploadDocument = async (uri, fileName, sender, email) => {
        try {
            const reference = storage().ref(fileName);
            await reference.putFile(uri);
            const url = await reference.getDownloadURL();
            const currentDate = new Date();
            const dateTimeString = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
            await firestore().collection('documents').add({ name: fileName, url: url, dateTime: dateTimeString, sender: sender, email: email });
            return url;
        } catch (error) {
            console.error('Upload failed:', error);
            Alert.alert('Error', 'An error occurred while uploading the document');
            throw error;
        }
    };

    const openDocument = async (url) => {
        try {
            await Linking.openURL(url);
        } catch (error) {
            console.error('Error opening document:', error);
            Alert.alert('Error', 'An error occurred while opening the document');
        }
    };

    const downloadDocument = async (url) => {
        try {
            const fileName = url.split('/').pop();
            const filePath = FileSystem.documentDirectory + fileName;

            const downloadResponse = await FileSystem.downloadAsync(
                url,
                filePath
            );

            console.log('File downloaded to:', downloadResponse.uri);
        } catch (error) {
            console.error('Error downloading document:', error);
            Alert.alert('Error', 'An error occurred while downloading the document');
        }
    };

    return (
        <>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>Contenu des documents</Text>
                    {error && <Text style={styles.errorText}>Une erreur est survenue : {error.message}</Text>}
                    {loading ? <ActivityIndicator size="large" color="#187ecc" /> : (
                        <View style={styles.documentList}>
                            {documents.map((document, index) => (
                                <TouchableOpacity key={index} style={styles.documentRow} onPress={() => openDocument(document.url)}>
                                    {document.url && document.url.endsWith('.jpg') ? (
                                        <Image
                                            source={{ uri: document.url }}
                                            style={{ width: 50, height: 50, marginRight: 10, borderRadius: 5 }}
                                        />
                                    ) : (
                                        <Image
                                            source={{ uri: document.url }}
                                            style={{ width: 50, height: 50, marginRight: 10, borderRadius: 5 }}
                                            resizeMode="cover"
                                        />
                                    )}
                                    <View>
                                        <Text style={styles.documentName}>{document.name}</Text>
                                        <Text style={{ fontSize: 12, color: 'gray' }}>Déposé par {document.sender}</Text>
                                        <Text style={{ fontSize: 12, color: 'gray' }}>{document.dateTime}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
            <View style={styles.addButton}>
                <TouchableOpacity onPress={pickDocument} style={styles.addButtonContainer}>
                    <MaterialCommunityIcons name="plus" size={20} color="white" />
                    <Text style={styles.buttonText}>Ajouter un document</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default DocumentsScreen;
