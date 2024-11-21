import { Box, Text, HStack, Image } from "@chakra-ui/react";
import { useContext } from "react";
import { AppContext } from "../../store/app.context";
import { useNavigate } from "react-router-dom";
import "./UserInfo.css";
import defaultProfilePicture from "../../resources/defaultProfilePicture.png";

export default function UserInfo() {
    const { userData } = useContext(AppContext);
    const navigate = useNavigate();

    const handleSettingsClick = () => {
        navigate("/profile");
    };

    return (
        <Box
            position="fixed"
            width="250px"
            height="100px"
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
                {/* User's Profile Picture */}
                <Image
                    mb="40px"
                    ml="20px"
                    boxSize="40px"
                    borderRadius="full"
                    src={userData?.photoURL || defaultProfilePicture}
                    alt="User Profile"
                />
                {/* User's Username */}
                <Text color="white" fontSize="lg" fontWeight="bold" mt="40px" mr="20px" ml="-52px">
                    {userData?.username || "Loading..."}
                </Text>
                {/* Settings Icon */}
                <HStack spacing={1} className="settings-container" onClick={handleSettingsClick} fontSize="22px">
                    <Text className="emoji">
                        ⚙️
                    </Text>
                    <Text className="settings-text">User Settings</Text>
                </HStack>
            </HStack>
                <Text color='white' fontSize="xs" mt={10}>Created on: {userData.createdOn.slice(0, 10)}</Text>
        </Box>
    );
}
