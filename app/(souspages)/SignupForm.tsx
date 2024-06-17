import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SignupForm = ({ onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [ssn, setSsn] = useState('');
    const [isDoctor, setIsDoctor] = useState(false);

    const handleSignup = async () => {
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            await firestore().collection('users').doc(user.uid).set({
                email,
                firstName,
                lastName,
                phoneNumber,
                birthDate,
                ssn,
                isDoctor
            });

            console.log('User account created & signed in!');
        } catch (error) {
            console.error('Error creating account: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Inscription</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Prénom"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Nom"
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                style={styles.input}
                placeholder="Numéro de téléphone"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Date de naissance (AAAA-MM-JJ)"
                value={birthDate}
                onChangeText={setBirthDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Numéro de sécurité sociale"
                value={ssn}
                onChangeText={setSsn}
            />
            <View style={styles.switchContainer}>
                <Text>Êtes-vous médecin ?</Text>
                <Switch
                    value={isDoctor}
                    onValueChange={setIsDoctor}
                />
            </View>
            <Button title="S'inscrire" onPress={handleSignup} />
            <Button title="Retour à la connexion" onPress={onBackToLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#187ecc',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
});

export default SignupForm;
