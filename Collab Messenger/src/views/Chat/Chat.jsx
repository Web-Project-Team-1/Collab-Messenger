import { Box, VStack, HStack, Input, Button, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/app.context";
import useChat from "../../components/Chat/useChat";
import EmojiPicker from "emoji-picker-react";

export default function Chat({ teamId, channelId }) {
  const { user } = useContext(AppContext);
  const { messages, message, setMessage, sendMessage } = useChat(teamId, channelId);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  useEffect(() => {}, [teamId, channelId]);

  return (
    <VStack h="790px" mt={"75px"} spacing={0} align="stretch" bg="gray.900">
      {/* Messages Display */}
      <VStack
        flex="1"
        overflowY="auto"
        spacing={4}
        px={4}
        align="stretch"
        bg="gray.800"
      >
        {messages.map((msg, index) => (
          <HStack
            key={index}
            justify={msg.senderId === user.uid ? "flex-end" : "flex-start"}
            width="100%"
          >
            <Box
              bg={msg.senderId === user.uid ? "blue.500" : "gray.700"}
              color="white"
              px={4}
              py={2}
              borderRadius="lg"
              width="50%"
              mt={3}
              boxShadow="md"
            >
              <Text fontSize="sm" fontWeight="bold" mb={1}>
                {msg.username}
              </Text>
              <Text fontSize="md">{msg.text}</Text>
              <Text fontSize="xs" textAlign="right" opacity={0.6}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </Text>
            </Box>
          </HStack>
        ))}
      </VStack>

      {/* Input Section */}
      <Box p={4} bg="gray.900" borderTop="1px solid" borderColor="gray.700">
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
              <Box position="absolute" bottom="60px" right="90px" zIndex="1000">
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
  );
}
