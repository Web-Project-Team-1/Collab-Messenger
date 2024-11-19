import { Box, VStack, Button, Text, HStack, Input, Flex } from '@chakra-ui/react';
import { useContext } from 'react';
import { AppContext } from '../../store/app.context';
import { useLocation } from 'react-router-dom';
import usePersonalChats from '../../components/PersonalChats/usePersonalChats';

export default function PersonalChats() {
    const { user } = useContext(AppContext);
    const location = useLocation();
    const {
        message,
        setMessage,
        messages,
        chats,
        selectedReceiverId,
        setSelectedReceiverId,
        sendMessage,
    } = usePersonalChats(location.state?.receiverId || null);

    return (
        <Flex className="personalChatContainer" bg="gray.700" boxShadow="lg" height="100vh">
            {/* Sidebar with list of personal chats */}
            <VStack className="chatSidebar" bg="gray.800" width="250px" p={4} align="start" overflowY="auto">
                <Text fontWeight="bold" color="white" mb={4}>Personal Chats</Text>
                {chats.map((chat, idx) => (
                    <Button
                        key={idx}
                        onClick={() => setSelectedReceiverId(chat.receiverId)}
                        colorScheme="teal"
                        variant="ghost"
                        w="full"
                        textAlign="left"
                        color="white"
                    >
                        {chat.username}
                    </Button>
                ))}
            </VStack>

            {/* Main chat area */}
            <VStack flex="1" className="chatMainArea" bg="gray.800" boxShadow="lg" pt="4rem">
                {/* Message container */}
                <Box className="messageContainer" bg="gray.800" w="full" p={4} overflowY="auto" maxHeight="calc(100vh - 150px)">
                    {messages.map((msg, idx) => (
                        <Box key={idx} p={1} mb={1} bg="transparent" border="none" borderRadius="none">
                            <Text fontWeight="bold" color="white">{msg.username}:</Text>
                            <Text color="white">{msg.text}</Text>
                        </Box>
                    ))}
                </Box>

                {/* Message input */}
                <Box className="inputContainer" w="full" p={4} borderTop="1px solid #333">
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
        </Flex>
    );
}
