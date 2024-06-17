import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

const SignupForm = ({ onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            await auth().createUserWithEmailAndPassword(email, password);
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
});

export default SignupForm;
