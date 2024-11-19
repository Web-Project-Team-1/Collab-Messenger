import { Box, VStack, Button, Text, HStack, Input } from '@chakra-ui/react';
import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../store/app.context';
import usePersonalChats from '../../components/PersonalChats/usePersonalChats';
import { ref, onValue, get, push } from 'firebase/database';
import { db } from '../../config/firebase.config';
import { createPersonalChat } from '../../services/personal.chats.service';

export default function PersonalChats() {
    const { user } = useContext(AppContext);
    const [selectedReceiverId, setSelectedReceiverId] = useState(null);
    const { message, setMessage, messages, sendMessage } = usePersonalChats({ receiverId: selectedReceiverId });
    const [chats, setChats] = useState([]);

    const handleChatSelect = async (receiverId) => {
        setSelectedReceiverId(receiverId);
        console.log(receiverId)
        const chatId = [user.uid, receiverId].sort().join('_');
        const chatRef = ref(db, `personalChats/${chatId}`);

        const snapshot = await get(chatRef);
        if (!snapshot.exists()) {
            await createPersonalChat(user.uid, receiverId); 
        } else {
            const messagesRef = ref(db, `personalChats/${chatId}/messages`);
            onValue(messagesRef, (snapshot) => {
                const messagesData = snapshot.val();
                if (messagesData) {
                    const messages = Object.values(messagesData);
                    setMessage(messages);
                }
            });
        }
    };

    return (
        <VStack className="chatContainer" bg="gray.700" boxShadow="lg">
            {/* List of chats */}
            <Box className="chatList" bg="gray.800" w="full" p={4}>
                {chats.map((chat, idx) => (
                    <Button key={idx} onClick={() => handleChatSelect(chat.receiverId)} colorScheme="blue" w="full" mb={2}>
                        {chat.username}
                    </Button>
                ))}
            </Box>

            {/* Message container */}
            <Box className="messageContainer" bg="gray.800" w="full" p={4} overflowY="scroll" maxHeight="400px">
                {messages.map((msg, idx) => (
                    <Box key={idx} p={1} mb={1} bg="transparent" border="none" borderRadius="none">
                        <Text fontWeight="bold" color="white">{msg.username}:</Text>
                        <Text color="white">{msg.text}</Text>
                    </Box>
                ))}
            </Box>

            {/* Message input */}
            <Box className="inputContainer" w="full" p={4}>
                <HStack w="full">
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                        bg="gray.600"
                        border="none"
                        _placeholder={{ color: "gray.400" }}
                    />
                    <Button colorScheme="blue" onClick={sendMessage}>Send</Button>
                </HStack>
            </Box>
        </VStack>
    );
}
