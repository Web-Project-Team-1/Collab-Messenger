import { Box, Text, HStack, IconButton } from "@chakra-ui/react";
import { FaCog } from "react-icons/fa";
import { useContext } from "react";
import { AppContext } from "../../store/app.context";
import { useNavigate } from "react-router-dom";
import "./UserInfo.css";

export default function UserInfo() {
    const { userData } = useContext(AppContext);
    const navigate = useNavigate();

    const handleSettingsClick = () => {
        navigate("/profile");
    };

    return (
        <Box
            position="fixed"
            bottom="30px"
            right="25px"
            p={2}
            bg="gray.800"
            borderRadius="md"
            display="flex"
            alignItems="center"
            boxShadow="lg"
        >
            <HStack spacing={3}>
                <Text color="white" fontSize="sm" fontWeight="bold">
                    {userData?.username || "Loading..."}
                </Text>
                <IconButton
                    aria-label="Settings"
                    icon={<FaCog />}
                    size="sm"
                    variant="ghost"
                    color="white"
                    _hover={{ color: "gray.300" }}
                    onClick={handleSettingsClick}
                />
            </HStack>
        </Box>
    );
}
