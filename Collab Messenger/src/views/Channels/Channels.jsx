import { Box, Text, VStack, Button, Input } from "@chakra-ui/react";
import "./Channels.css";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function Channels({
    teams,
    activeTeamId,
    activeChannelId,
    setActiveChannelId,
    newChannelName,
    setNewChannelName,
    handleCreateChannel,
    showCreateChannelInput,
    setShowCreateChannelInput,
    inviteUsername,
    setInviteUsername,
    showInviteUserInput,
    setShowInviteUserInput,
    handleInviteUser
}) {
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const activeTeam = teams.find((team) => team.id === activeTeamId);
    const activeTeamName = activeTeam?.name || "Select a Team";

    const handleCreateChannelClick = () => setShowCreateChannelInput(true);
    const handleCreateChannelCancel = () => {
        setShowCreateChannelInput(false);
        setNewChannelName("");
    };
    const handleCreateChannelSubmit = () => {
        handleCreateChannel(activeTeamId, newChannelName, setNewChannelName);
        setShowCreateChannelInput(false);
    };

    const handleInviteUserClick = () => setShowInviteUserInput(true);
    const handleInviteUserCancel = () => {
        setShowInviteUserInput(false);
        setInviteUsername("");
    };
    const handleInviteUserSubmit = () => {
        handleInviteUser();
        setShowInviteUserInput(false);
    };

    const handleSettingsClick = () => setShowSettingsModal(true);
    const handleSettingsCancel = () => setShowSettingsModal(false);

    return (
        <Box className="channelSidebar" p={4} bg="gray.800" borderRight="1px solid gray.700">
            <Text fontSize="xl" color="white" fontWeight="bold" mb={2}>
                {activeTeamName}
            </Text>

            {/* Invite User Section */}
            <Box display="flex" alignItems="center" mb={4}>
                <Box
                    className="inviteUserIconContainer"
                    onClick={handleInviteUserClick}
                    position="relative"
                    zIndex={2}
                    cursor="pointer"
                >
                    <Text className="emoji" fontSize="2xl" color="white">👤</Text>
                    <Text className="plusSign" fontSize="1.25rem">+</Text>
                    <Text className="inviteText">Invite User</Text>
                </Box>
                <Box
                    className="settingsIconContainer"
                    onClick={handleSettingsClick}
                    position="relative"
                    zIndex={2}
                    cursor="pointer"
                    ml={4}
                >
                    <Text className="emoji" fontSize="2xl" color="white">⚙️</Text>
                    <Text className="settingsText">Settings</Text>
                </Box>
            </Box>

            {/* Invite User Input Overlay */}
            {showInviteUserInput && (
                <Box
                    className="createInviteOverlay"
                    position="absolute"
                    top="150px"
                    left="300px"
                    p={4}
                    bg="gray.800"
                    borderRadius="md"
                    boxShadow="lg"
                    zIndex="10"
                    border="1px solid"
                    borderColor={"blue.500"}
                >
                    <Text color="white" mb={2}>Enter Username</Text>
                    <Input
                        type="text"
                        placeholder="Username"
                        value={inviteUsername}
                        onChange={(e) => setInviteUsername(e.target.value)}
                        mb={2}
                        bg="gray.700"
                        color="white"
                        _placeholder={{ color: "gray.400" }}
                    />
                    <Button
                        onClick={handleInviteUserSubmit}
                        width="100%"
                        variant="solid"
                        colorScheme="teal"
                        mb={2}
                    >
                        Invite
                    </Button>
                    <Button
                        onClick={handleInviteUserCancel}
                        width="100%"
                        variant="outline"
                        colorScheme="gray"
                    >
                        Cancel
                    </Button>
                </Box>
            )}

            {/* Settings Modal */}
            {showSettingsModal && (
                <Box
                    className="settingsOverlay"
                    position="absolute"
                    top="200px"
                    left="300px"
                    p={4}
                    bg="gray.800"
                    borderRadius="md"
                    boxShadow="lg"
                    zIndex="10"
                    border="1px solid"
                    borderColor={"blue.500"}
                >
                    <Text color="white" mb={2}>Team Settings</Text>
                    <Text color="white" mb={2}>Team Name: {activeTeamName}</Text>
                    <Text color="white" mb={2}>Channels:</Text>
                    <VStack align="stretch" spacing={2} mb={4}>
                        {activeTeam?.channels.map((channel) => (
                            <Text key={channel.id} color="white" pl={2}>
                                - {channel.name}
                            </Text>
                        ))}
                    </VStack>
                    <Button
                        onClick={handleSettingsCancel}
                        width="100%"
                        variant="outline"
                        colorScheme="gray"
                    >
                        Close
                    </Button>
                </Box>
            )}

            <Text fontSize="lg" color="white" mb={2}>
                Channels
            </Text>
            <VStack align="stretch" spacing={3}>
                {activeTeam?.channels.map((channel) => (
                    <Button
                        key={channel.id}
                        variant="solid"
                        colorScheme="teal"
                        onClick={() => setActiveChannelId(channel.id)}
                        width="100%"
                        border="1px solid"
                        borderColor={channel.id === activeTeamId ? "blue.500" : "gray.600"}
                        bg={channel.id === activeTeamId ? "gray.700" : "gray.800"}
                        _hover={{ bg: "blue.600", transform: "scale(1.05)" }} 
                        _focus={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }} 
                        _active={{ bg: "blue.600" }} 
                        transition="all 0.3s ease-in-out" 
                        leftIcon={<FaPlus />} 
                        borderRadius="30px" 
                    >
                        {channel.name}
                    </Button>
                ))}
            </VStack>

            {/* Create Channel Button */}
            <Button
                onClick={handleCreateChannelClick}
                width="100%"
                variant="solid"
                colorScheme="blue"
                mt={4}
                leftIcon={<FaPlus />}
                _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
                _focus={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}
                _active={{ bg: "blue.800" }}
                transition="all 0.3s ease-in-out"
                borderRadius="30px" 
            >
                Create Channel
            </Button>

            {/* Channel Name Input Overlay */}
            {showCreateChannelInput && (
                <Box
                    className="createChannelOverlay"
                    position="absolute"
                    top="325px"
                    left="300px"
                    p={4}
                    bg="gray.800"
                    borderRadius="md"
                    boxShadow="lg"
                    zIndex="10"
                    border="1px solid"
                    borderColor={"blue.500"}
                >
                    <Text color="white" mb={2}>Enter Channel Name</Text>
                    <Input
                        type="text"
                        placeholder="Channel Name"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                        mb={2}
                        bg="gray.700"
                        color="white"
                        _placeholder={{ color: "blue.400" }}
                        borderRadius="30px"
                    />
                    <Button
                        onClick={handleCreateChannelSubmit}
                        width="100%"
                        variant="solid"
                        colorScheme="blue"
                        mb={2}
                        _hover={{ bg: "blue.600" }}
                        _focus={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}
                        _active={{ bg: "blue.800" }}
                        borderRadius="30px"
                    >
                        Create
                    </Button>
                    <Button
                        onClick={handleCreateChannelCancel}
                        width="100%"
                        variant="solid"
                        colorScheme="blue"
                        mb={2}
                        _hover={{ bg: "blue.600" }}
                        _focus={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}
                        _active={{ bg: "blue.800" }}
                        borderRadius="30px"
                    >
                        Cancel
                    </Button>
                </Box>
            )}
        </Box>
    );
}
