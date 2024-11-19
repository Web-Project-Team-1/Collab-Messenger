import { useContext, useEffect, useState } from 'react';
import { db } from '../../config/firebase.config';
import { AppContext } from '../../store/app.context';
import { ref, push, onValue, off, get } from 'firebase/database';
import { createPersonalChat } from '../../services/personal.chats.service';
import { getUserData } from '../../services/users.service';

export default function usePersonalChats(initialReceiverId = null) {
  const { user } = useContext(AppContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedReceiverId, setSelectedReceiverId] = useState(initialReceiverId);

  useEffect(() => {
    if (user?.uid) fetchChats();
  }, [user?.uid]);

  useEffect(() => {
    if (selectedReceiverId) handleChatSelect(selectedReceiverId);
  }, [selectedReceiverId]);

  const fetchChats = async () => {
    const chatsRef = ref(db, 'personalChats');
    onValue(chatsRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userChats = await Promise.all(
          Object.keys(data)
            .filter((chatId) => chatId.includes(user.uid))
            .map(async (chatId) => {
              const otherUserId = chatId.replace(user.uid, '').replace('_', '');
              const otherUserData = await getUserData(otherUserId);
              return {
                receiverId: otherUserId,
                username: otherUserData ? otherUserData.username : 'Unknown',
              };
            })
        );
        setChats(userChats);
      }
    });
  };

  const handleChatSelect = async (receiverId) => {
    setSelectedReceiverId(receiverId);
    const chatId = [user.uid, receiverId].sort().join('_');
    const chatRef = ref(db, `personalChats/${chatId}`);

    const snapshot = await get(chatRef);
    if (!snapshot.exists()) {
      await createPersonalChat(user.uid, receiverId);
    } else {
      const messagesRef = ref(db, `personalChats/${chatId}/messages`);
      onValue(messagesRef, (snapshot) => {
        const messagesData = snapshot.val();
        const loadedMessages = messagesData ? Object.values(messagesData) : [];
        setMessages(loadedMessages);
      });
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const chatId = [user.uid, selectedReceiverId].sort().join('_');
    const messagesRef = ref(db, `personalChats/${chatId}/messages`);

    const messageData = {
      text: message,
      senderId: user.uid,
      username: user.username || user.email,
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
    chats,
    selectedReceiverId,
    setSelectedReceiverId,
    sendMessage,
  };
}
