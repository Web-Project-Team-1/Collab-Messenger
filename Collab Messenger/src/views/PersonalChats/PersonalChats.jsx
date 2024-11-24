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
        <Flex h="100vh" bg="gray.700">
            {/* Sidebar for personal chats */}
            <VStack
                bg="gray.800"
                p={4}
                spacing={4}
                boxShadow="lg"
                overflowY="auto"
                mt={14}
                w="12%"
            >
                <Text fontWeight="bold" color="white" fontSize="lg" mb={7} mt={4}>
                    Personal Chats
                </Text>
                {chats.length > 0 ? (
                    chats.map((chat, idx) => (
                        <Button
                            variant={'solid'}
                            key={idx}
                            onClick={() => setSelectedReceiverId(chat.receiverId)}
                            colorScheme={selectedReceiverId === chat.receiverId ? 'blue' : 'gray'}
                            bg={selectedReceiverId === chat.receiverId ? 'blue.600' : 'black'}
                            color="white"
                            w="full"
                            textAlign="left"
                            _hover={{ bg: selectedReceiverId === chat.receiverId ? 'blue.500' : 'gray.700' }}
                        >
                            {chat.username}
                        </Button>
                    ))
                ) : (
                    <Text color="gray.400">No chats available</Text>
                )}
            </VStack>

            {/* Main chat area */}
            <VStack w="75%" spacing={0} flex="1" bg="gray.900" p={4} mt={14}>
                {/* Message container */}
                <Box
                    flex="1"
                    w="full"
                    p={4}
                    bg="gray.800"
                    borderRadius="md"
                    overflowY="auto"
                    maxHeight="calc(100vh - 150px)"
                >
                    {messages.length > 0 ? (
                        messages.map((msg, idx) => (
                            <Box key={idx} mb={3}>
                                <Text fontWeight="bold" color="teal.300">
                                    {msg.username}:
                                </Text>
                                <Text color="white">{msg.text}</Text>
                            </Box>
                        ))
                    ) : (
                        <Text color="gray.400">No messages yet. Start the conversation!</Text>
                    )}
                </Box>

                {/* Message input */}
                <HStack w="full" p={4} spacing={4} bg="gray.800" borderTop="1px solid #333">
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                        bg="gray.600"
                        color="white"
                        _placeholder={{ color: 'gray.400' }}
                        flex="1"
                    />
                    <Button colorScheme="blue" onClick={sendMessage}>
                        Send
                    </Button>
                </HStack>
            </VStack>
        </Flex>
    );
}
