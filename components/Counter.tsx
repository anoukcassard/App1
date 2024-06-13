// import React, {useEffect, useState} from 'react';
// import { Text, TextInput } from 'react-native';

// const Counter = () => {
//     const [text, setText] = useState('');
//     const [isLongText, setIsLongText] = useState(false);

//     useEffect(() => {
//         if (text.length > 140) {
//             setIsLongText(true);
//         } else {
//             setIsLongText(false);
//         }
//     }, [text]);

//     let words = 1
//     let sentences = 1;
//     for (let i = 0; i < text.length; i++) {
//         switch(text[i]) {
//             case ' ':
//                 if (i < text.length - 1){
//                     words++;
//                 }
//                 break;
//             case '.':
//                 if (i < text.length - 1) {
//                     sentences++;
//                 }
//                 break;
//             default:
//                 break;
//         }
//     }

//     return <>{isLongText ? <Text>Le texte est trop long.</Text> : <Text></Text>}
//         <TextInput value={text} onChangeText={setText} placeholder={"Entrez"}></TextInput>
//         <Text>Nombre de lettres : {text.length}</Text>
//         <Text>Nombre de mots : {words}</Text>
//         <Text>Nombre de phrases : {sentences}</Text>
//         </>;
// }

// export default Counter;