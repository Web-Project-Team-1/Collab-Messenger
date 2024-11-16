import {
    Box,
    VStack,
    HStack,
    Input,
    Button,
    Text,
  } from "@chakra-ui/react";
  import { useState, useEffect, useContext } from "react";
  import { ref, push, onValue, off } from "firebase/database";
  import { db } from "../../config/firebase.config";
  import { AppContext } from "../../store/app.context";
  
  export default function Chat({ teamId }) {
    const { user } = useContext(AppContext);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
  
    useEffect(() => {
      const messagesRef = ref(db, `teams/${teamId}/chat`);
      const listener = (snapshot) => {
        const data = snapshot.val();
        const loadedMessages = data ? Object.values(data) : [];
        setMessages(loadedMessages);
      };
      onValue(messagesRef, listener);
      return () => {
        off(messagesRef, "value", listener);
      };
    }, [teamId]);
  
    const sendMessage = async () => {
      if (!message.trim()) return;
  
      const messageData = {
        text: message,
        senderId: user.uid,
        username: user.email,
        timestamp: Date.now(),
      };
  
      const messagesRef = ref(db, `teams/${teamId}/chat`);
      await push(messagesRef, messageData);
      setMessage("");
    };
  
    return (
      <VStack
        spacing={6}
        p={6}
        bg="gray.700"
        borderRadius="lg"
        boxShadow="lg"
        w="1300px"
        h="550px"
      >
        <Box
          flex="1"
          w="full"
          p={6}
          bg="gray.800"
          borderRadius="md"
          overflowY="auto"
          maxHeight="450px"
          css={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#4A5568",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#2D3748",
            },
          }}
        >
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              p={4}
              mb={4}
              bg="gray.600"
              borderRadius="md"
            >
              <Text fontWeight="bold">{msg.username}:</Text>
              <Text>{msg.text}</Text>
            </Box>
          ))}
        </Box>
        <HStack w="full">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            bg="gray.600"
            border="none"
            _placeholder={{ color: "gray.400" }}
          />
          <Button colorScheme="blue" onClick={sendMessage}>
            Send
          </Button>
        </HStack>
      </VStack>
    );
  }
  