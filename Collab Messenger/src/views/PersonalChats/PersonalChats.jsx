import { Box, VStack, Button, Text, HStack, Input, Flex } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { AppContext } from '../../store/app.context';
import { useLocation } from 'react-router-dom';
import usePersonalChats from '../../components/PersonalChats/usePersonalChats';
import EmojiPicker from "emoji-picker-react";

export default function PersonalChats() {
    const { user } = useContext(AppContext);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const location = useLocation();

    const {
        message,
        setMessage,
        messages,
        chats,
        selectedReceiverId,
        setSelectedReceiverId,
        sendMessage,
        addReaction, 
    } = usePersonalChats(location.state?.receiverId || null);

    const handleEmojiClick = (emojiObject) => {
        setMessage((prev) => prev + emojiObject.emoji);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() !== "") {
            sendMessage(message);
            setMessage("");
        }
    };

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
                w="15%"
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
            <VStack w="80%" spacing={0} flex="1" bg="gray.900" p={4} mt={14}>
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
                            <Box
                                key={idx}
                                mb={3}
                                display="flex"
                                justifyContent={msg.senderId === user.uid ? 'flex-end' : 'flex-start'}
                            >
                                <Box
                                    bg={msg.senderId === user.uid ? 'blue.500' : 'gray.700'}
                                    color="white"
                                    px={4}
                                    py={2}
                                    borderRadius="lg"
                                    width="50%"
                                    boxShadow="md"
                                >
                                    <Text fontWeight="bold" color="teal.300">
                                        {msg.senderId === user.uid ? 'You' : msg.username}
                                    </Text>
                                    <Text>{msg.text}</Text>
                                    <Text fontSize="xs" opacity={0.6} textAlign="right">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </Text>
                                    {/* Reactions */}
                                    <HStack mt={2} spacing={2}>
                                        {Object.entries(msg.reactions || {}).map(([emoji, count]) => (
                                            <Box
                                                key={emoji}
                                                as="button"
                                                onClick={() => addReaction(msg.id, emoji)}
                                                px={2}
                                                py={1}
                                                borderRadius="md"
                                                bg="gray.600"
                                                color="white"
                                                fontSize="sm"
                                            >
                                                {emoji} {count}
                                            </Box>
                                        ))}
                                    </HStack>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Text color="gray.400">No messages yet. Start the conversation!</Text>
                    )}
                </Box>
                {/* Input Section */}
                <Box p={4} bg="gray.900" borderTop="1px solid" borderColor="gray.700" w="full">
                    <form onSubmit={handleSendMessage}>
                        <HStack spacing={2}>
                            <Input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                bg="gray.700"
                                color="white"
                                _placeholder={{ color: "gray.400" }}
                                flex="1"
                                borderRadius="md"
                            />
                            <Button
                                onClick={() => setShowEmojiPicker((prev) => !prev)}
                                colorScheme="blue"
                                px={4}
                                _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
                                _focus={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}
                                _active={{ bg: "blue.800" }}
                                transition="all 0.3s ease-in-out"
                                borderRadius="md"
                            >
                                😀
                            </Button>
                            {showEmojiPicker && (
                                <Box position="absolute" bottom="70px" right="120px" zIndex="1000">
                                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                                </Box>
                            )}
                            <Button
                                type="submit"
                                colorScheme="blue"
                                px={6}
                                _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
                                _focus={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}
                                _active={{ bg: "blue.800" }}
                                transition="all 0.3s ease-in-out"
                                borderRadius="md"
                            >
                                Send
                            </Button>
                        </HStack>
                    </form>
                </Box>
            </VStack>
        </Flex>
    );
}
