import { ref, set, push, get, update, child } from 'firebase/database';
import { db } from '../config/firebase.config';

export const createPersonalChat = async (userId1, userId2) => {
    if (!userId1 || !userId2) {
        throw new Error("Both user IDs are required.");
    }

    const chatId = userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
    console.log(`Creating chat with ID: ${chatId}`); 

    const newChatRef = ref(db, `personalChats/${chatId}`);

    const snapshot = await get(newChatRef);
    if (!snapshot.exists()) {
        const chatData = {
            users: { [userId1]: true, [userId2]: true },
            messages: {}
        };
        await set(newChatRef, chatData);
        console.log(`Chat created successfully: ${chatId}`); 
    } else {
        console.log(`Chat already exists: ${chatId}`); 
    }

    return chatId;
};

const sendMessage = async () => {
    if (!message.trim() || !user?.uid || !selectedReceiverId) return;

    const chatId = [user.uid, selectedReceiverId].sort().join('_');
    const messagesRef = ref(db, `personalChats/${chatId}/messages`);

    const messageData = {
        text: message,
        senderId: user.uid,
        username: user.email,
        timestamp: Date.now(),
    };

    try {
        await push(messagesRef, messageData);
        setMessage(''); 
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

export const getMessages = async (chatId) => {
    if (!chatId) {
        throw new Error("Chat ID is required.");
    }

    const messagesRef = ref(db, `personalChats/${chatId}/messages`);
    const snapshot = await get(messagesRef);

    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        throw new Error("No messages found.");
    }
};
