const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotificationOnNewMessage = functions.firestore
    .document('conversations/{conversationId}/messages/{messageId}')
    .onCreate(async (snapshot, context) => {
        const messageData = snapshot.data();
        const conversationId = context.params.conversationId;

        // Récupérer les détails de la conversation
        const conversationDoc = await admin.firestore().collection('conversations').doc(conversationId).get();
        const conversation = conversationDoc.data();

        // Déterminer le destinataire
        const recipientId = messageData.senderId === conversation.doctorId ? conversation.patientId : conversation.doctorId;

        // Récupérer le token de notification du destinataire
        const userDoc = await admin.firestore().collection('users').doc(recipientId).get();
        const user = userDoc.data();
        const fcmToken = user.fcmToken; // Assurez-vous que ce champ existe

        if (fcmToken) {
            // Envoyer la notification
            const payload = {
                notification: {
                    title: 'Nouveau message',
                    body: messageData.text,
                },
                token: fcmToken,
            };

            await admin.messaging().send(payload);
            console.log('Notification sent successfully');
        } else {
            console.log('No FCM token for user, notification not sent');
        }
    });
