import React, { useContext, useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

export const TextContext = React.createContext("");

const TextInputEnter = () => {
    const [text, setText] = useState(''); // État local pour le texte d'entrée
    const contextText = useContext(TextContext); // Texte provenant du contexte

    // Utilisation d'un effet pour synchroniser l'état local avec le contexte
    useEffect(() => {
        if (contextText !== text) {
            setText(contextText);
        }
    }, [contextText]);

    return (
        <TextInput 
            value={text} 
            onChangeText={setText} 
            placeholder={"Entrez"} 
        />
    );
}

const TextLength = () => {
    const text = useContext(TextContext);
    return <Text>Nombre de lettres : {text.length}</Text>
}

const WordCount = () => {
    const text = useContext(TextContext);
    let words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return <Text>Nombre de mots : {words}</Text>
}

const SentenceCount = () => {
    const text = useContext(TextContext);
    let sentences = text.trim() ? text.split('.').filter(Boolean).length : 0;
    return <Text>Nombre de phrases : {sentences}</Text>
}

const Counter = () => {
    const [text, setText] = useState('');
    const [isLongText, setIsLongText] = useState(false);

    useEffect(() => {
        if (text.length > 140) {
            setIsLongText(true);
        } else {
            setIsLongText(false);
        }
    }, [text]);

    return (
        <TextContext.Provider value={text}>
            <View>
                {isLongText ? <Text>Le texte est trop long.</Text> : null}
                <TextInputEnter />
                <TextLength />
                <WordCount />
                <SentenceCount />
            </View>
        </TextContext.Provider>
    );
}

export default Counter;
