import { useContext, useEffect, useState } from 'react';
import { db } from '../../config/firebase.config';
import { AppContext } from '../../store/app.context';
import { ref, push, onValue, off } from 'firebase/database';

export default function usePersonalChats({ receiverId }) {
  const { user } = useContext(AppContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user?.uid || !receiverId) return;

    const chatId = [user.uid, receiverId].sort().join('_');
    const messagesRef = ref(db, `personalChats/${chatId}`);

    const listener = (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = data ? Object.values(data) : [];
      setMessages(loadedMessages);
    };

    onValue(messagesRef, listener);

    return () => {
      off(messagesRef, 'value', listener);
    };
  }, [user?.uid, receiverId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const chatId = [user.uid, receiverId].sort().join('_');
    const messagesRef = ref(db, `personalChats/${chatId}`);

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

  return {
    message,
    setMessage,
    messages,
    sendMessage,
  };
}
