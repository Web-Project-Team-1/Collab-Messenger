import { Box, VStack, HStack, Input, Button, Text } from "@chakra-ui/react";
import useChat from "../../components/chat/useChat";
import './Chat.css';

export default function Chat({ teamId }) {
    const { message, setMessage, messages, sendMessage } = useChat(teamId);

    return (
        <VStack className="chatContainer" bg="gray.700" boxShadow="lg">
            {/* Scrollable chat messages */}
            <Box className="messageContainer" bg="gray.800">
                {messages.map((msg, idx) => (
                    <Box key={idx} p={1} mb={1} bg="transparent" border="none" borderRadius="none">
                        <Text fontWeight="bold" color="white">
                            {msg.username}:
                        </Text>
                        <Text color="white">{msg.text}</Text>
                    </Box>
                ))}
            </Box>

            {/* Message input and send button at the bottom */}
            <Box className="inputContainer">
                <HStack w="full">
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                        className="inputField"
                        bg="gray.600"
                        border="none"
                        _placeholder={{ color: "gray.400" }}
                    />
                    <Button className="sendButton" colorScheme="blue" onClick={sendMessage}>
                        Send
                    </Button>
                </HStack>
            </Box>
        </VStack>
    );
}
