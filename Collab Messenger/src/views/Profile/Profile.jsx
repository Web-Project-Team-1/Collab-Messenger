import { Box, Text, VStack } from "@chakra-ui/react";
import { useContext } from "react";
import { AppContext } from "../../store/app.context";

export default function Profile() {
    const { user } = useContext(AppContext);

    if (!user) {
        return <Text>Loading...</Text>;
    }

    return (
        <Box p={5} bg="gray.700" color="white" borderRadius="md" maxW="400px" m="auto" mt="50px">
            <VStack spacing={4} align="start">
                <Text fontSize="2xl" fontWeight="bold">User Profile</Text>
                <Text><strong>Username:</strong> {user.username}</Text>
                <Text><strong>Email:</strong> {user.email}</Text>
            </VStack>
        </Box>
    );
}
