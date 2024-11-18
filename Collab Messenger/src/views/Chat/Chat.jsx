import { Box, VStack, HStack, Input, Button, Text } from "@chakra-ui/react";
import useChat from "../../components/chat/useChat";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase.config";
import { get, ref } from "firebase/database";
import { getUserData } from "../../services/users.service";
import './Chat.css';

export default function Chat({ teamId, channelId }) {
    const { message, setMessage, messages, sendMessage } = useChat(teamId, channelId);
    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        const fetchTeamMembers = async () => {
            const teamRef = ref(db, `teams/${teamId}`);
            const snapshot = await get(teamRef);
            if (snapshot.exists()) {
                const teamData = snapshot.val();
                const memberIds = Object.keys(teamData.members);

                const memberUsernames = await Promise.all(
                    memberIds.map(async (memberId) => {
                        const userData = await getUserData(memberId);
                        return userData ? userData.username : memberId;  
                    })
                );
                setTeamMembers(memberUsernames);
            }
        };

        fetchTeamMembers();

        return () => setTeamMembers([]);
    }, [teamId]);

    return (
        <VStack className="chatContainer" bg="gray.700" boxShadow="lg">
            {/* Scrollable chat messages */}
            <Box className="messageContainer" bg="gray.800">
                {messages.map((msg, idx) => (
                    <Box key={idx} p={1} mb={1} bg="transparent" border="none" borderRadius="none">
                        <Text fontWeight="bold" color="white">{msg.username}:</Text>
                        <Text color="white">{msg.text}</Text>
                    </Box>
                ))}
            </Box>

            {/* Message input and send button */}
            <Box className="inputContainer">
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

            {/* Display Team Members */}
            <Box className="membersContainer" p={2} fontSize="sm" bg="gray.800">
                <Text color="white" mb={2}>Team Members:</Text>
                {teamMembers.length > 0 ? (
                    teamMembers.map((username, idx) => (
                        <Text key={idx} color="white">{username}</Text>
                    ))
                ) : (
                    <Text color="gray.400">No members found</Text>
                )}
            </Box>
        </VStack>
    );
}
