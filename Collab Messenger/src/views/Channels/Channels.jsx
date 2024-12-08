import { Box, Text, VStack, Button, Input, HStack } from "@chakra-ui/react";
import "./Channels.css";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import editIcon from "../../resources/edit.png";
import { img } from "framer-motion/client";

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
    handleInviteUser,
    handleUpdateChannelName,
}) {
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [editingChannelId, setEditingChannelId] = useState(null);
    const [editedChannelName, setEditedChannelName] = useState("");

    const activeTeam = teams.find((team) => team.id === activeTeamId);
    const activeTeamName = activeTeam?.name;

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

    const startEditingChannel = (channelId, currentName) => {
        setEditingChannelId(channelId);
        setEditedChannelName(currentName);
    };

    const cancelEditingChannel = () => {
        setEditingChannelId(null);
        setEditedChannelName("");
    };

    const saveChannelName = async (channelId) => {
        if (editedChannelName.trim() === "") return;
        await handleUpdateChannelName(activeTeamId, channelId, editedChannelName);
        cancelEditingChannel();
    };

    return (
        <Box className="channelSidebar" pt={90} pl={2} pr={2} bg="gray.800" borderRight="1px solid gray.700">
            <Text fontSize="xl" color="white" fontWeight="bold" mb={2} textAlign="center">
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

            {/* Settings Modal */}
            {showSettingsModal && (
                <Box
                    className="settingsOverlay"
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
                    <Text color="white" mb={4} fontSize="lg">
                        Edit Channel Names
                    </Text>
                    <VStack align="stretch" spacing={3}>
                        {activeTeam?.channels.map((channel) => (
                            <HStack key={channel.id} align="center" spacing={2}>
                                {editingChannelId === channel.id ? (
                                    <>
                                        <Input
                                            value={editedChannelName}
                                            onChange={(e) => setEditedChannelName(e.target.value)}
                                            bg="gray.700"
                                            color="white"
                                            _placeholder={{ color: "gray.400" }}
                                        />
                                        <Button
                                            onClick={() => saveChannelName(channel.id)}
                                            variant="solid"
                                            colorScheme="blue"
                                            size="sm"
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            onClick={cancelEditingChannel}
                                            variant="outline"
                                            colorScheme="gray"
                                            size="sm"
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Text color="white">{channel.name}</Text>
                                        <Button
                                            onClick={() => startEditingChannel(channel.id, channel.name)}
                                            bg="gray.700"
                                            variant={"outline"}
                                            borderRadius={30}
                                            size={"sm"}
                                            border={"1px solid"}
                                        >
                                            <img src={editIcon} alt="edit" width="16" height="16" />
                                        </Button>
                                    </>
                                )}
                            </HStack>
                        ))}
                    </VStack>
                    <Button
                        onClick={handleSettingsCancel}
                        width="100%"
                        variant="outline"
                        colorScheme="gray"
                        mt={4}
                    >
                        Close
                    </Button>
                </Box>
            )}

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
                        colorScheme="blue"
                        mt={4}
                        leftIcon={<FaPlus />}
                        _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
                        _focus={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}
                        _active={{ bg: "blue.800" }}
                        transition="all 0.3s ease-in-out"
                        borderRadius="30px"
                    >
                        Invite
                    </Button>
                    <Button
                        onClick={handleInviteUserCancel}
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
                        Cancel
                    </Button>
                </Box>
            )}



            <Text fontSize="lg" color="white" mb={2} textAlign="center">
                Channels
            </Text>
            <VStack align="stretch" spacing={3}>
                {activeTeam?.channels.map((channel) => (
                    <HStack key={channel.id} align="center" spacing={2}>
                        <Button
                            variant="solid"
                            colorScheme="teal"
                            onClick={() => setActiveChannelId(channel.id)}
                            width="100%"
                            border="1px solid"
                            borderColor={channel.id === activeChannelId ? "blue.500" : "gray.600"}
                            bg={channel.id === activeChannelId ? "gray.700" : "gray.800"}
                            _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
                            _focus={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}
                            _active={{ bg: "blue.600" }}
                            transition="all 0.3s ease-in-out"
                            borderRadius="30px"
                        >
                            {channel.name}
                        </Button>
                    </HStack>
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
                border={"1px solid"}
            >
                Create Channel
            </Button>

            {showCreateChannelInput && (
                <Box
                    className="createChannelOverlay"
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
                    <Text color="white" mb={2}>Enter Channel Name</Text>
                    <Input
                        type="text"
                        placeholder="New Channel Name"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                        mb={2}
                        bg="gray.700"
                        color="white"
                        _placeholder={{ color: "gray.400" }}
                    />
                    <Button
                        onClick={handleCreateChannelSubmit}
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
                        Create
                    </Button>
                    <Button
                        onClick={handleCreateChannelCancel}
                        width="100%"
                        variant="outline"
                        colorScheme="gray"
                        mt={4}
                    >
                        Cancel
                    </Button>
                </Box>
            )}
        </Box>
    );
}
