import { Box, Text, VStack, Input, Button, Spinner } from "@chakra-ui/react";
import Chat from "../Chat/Chat";
import useTeamPage from "../../components/TeamPage/useTeamPage";
import UserInfo from "../../components/UserInfo/UserInfo";
import { useState } from "react";
import "./TeamPageLayout.css";

export default function TeamPageLayout() {
    const {
        teams,
        newTeamName,
        setNewTeamName,
        inviteUsername,
        setInviteUsername,
        activeTeamId,
        setActiveTeamId,
        activeChannelId,
        setActiveChannelId,
        isCreatingTeam,
        handleCreateTeam,
        handleInviteUser,
        handleCreateChannel,
    } = useTeamPage();

    const [newChannelName, setNewChannelName] = useState("");
    const [showCreateTeamInput, setShowCreateTeamInput] = useState(false);
    const [showCreateChannelInput, setShowCreateChannelInput] = useState(false);
    const [showInviteUserInput, setShowInviteUserInput] = useState(false);
    const activeTeamName = teams.find((team) => team.id === activeTeamId)?.name || "Select a Team";

    const handleCreateTeamClick = () => setShowCreateTeamInput(true);
    const handleCreateTeamCancel = () => {
        setShowCreateTeamInput(false);
        setNewTeamName("");
    };
    const handleCreateTeamSubmit = () => {
        handleCreateTeam();
        setShowCreateTeamInput(false);
    };

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

    return (
        <div className="teamPageContainer">
            {/* Teams Sidebar */}
            <Box className="sidebar" p={4} bg="gray.900" borderRight="1px solid gray.700">
                <Text fontSize="2xl" mb={4} color="white">
                    Teams
                </Text>
                <VStack align="stretch" spacing={3} className="sidebarButtonContainer">
                    {teams.map((team) => (
                        <Button
                            key={team.id}
                            variant="outline"
                            colorScheme="teal"
                            onClick={() => setActiveTeamId(team.id)}
                            width="100%"
                            border="1px solid"
                            borderColor={team.id === activeTeamId ? "blue.500" : "gray.600"}
                            bg={team.id === activeTeamId ? "gray.700" : "gray.800"}
                            _hover={{ bg: "gray.600" }}
                        >
                            {team.name}
                        </Button>
                    ))}
                </VStack>

                {/* Create Team Button */}
                <Button
                    onClick={handleCreateTeamClick}
                    width="100%"
                    variant="solid"
                    colorScheme="blue"
                    mt={4}
                >
                    Create Team
                </Button>

                {/* Team Name Input Overlay */}
                {showCreateTeamInput && (
                    <Box
                        className="createTeamOverlay"
                        position="absolute"
                        top="150px"
                        left="150px"
                        p={4}
                        bg="gray.800"
                        borderRadius="md"
                        boxShadow="lg"
                        zIndex="10"
                        border="1px solid"
                        borderColor={"blue.500"}
                    >
                        <Text color="white" mb={2}>Enter Team Name</Text>
                        <Input
                            type="text"
                            placeholder="Team Name"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            mb={2}
                            bg="gray.700"
                            color="white"
                            _placeholder={{ color: "gray.400" }}
                        />
                        <Button
                            onClick={handleCreateTeamSubmit}
                            width="100%"
                            variant="solid"
                            colorScheme="blue"
                            mb={2}
                            isLoading={isCreatingTeam}
                        >
                            Create
                        </Button>
                        <Button
                            onClick={handleCreateTeamCancel}
                            width="100%"
                            variant="outline"
                            colorScheme="gray"
                        >
                            Cancel
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Divider Line */}
            <Box width="1px" bg="gray.600" />

            {/* Channels Sidebar */}
            <Box className="channelSidebar" p={4} bg="gray.800" borderRight="1px solid gray.700">
                <Text fontSize="xl" color="white" fontWeight="bold" mb={2}>
                    {activeTeamName}
                </Text>

                {/* Invite User Section (Emoji + Sign) */}
                <Box
                    className="inviteUserIconContainer"
                    onClick={handleInviteUserClick}
                    position="relative"
                    zIndex={2}
                    cursor="pointer"
                    mb={4}
                >
                    <Text className="emoji" fontSize="3xl" color="white">👤</Text>
                    <Text className="plusSign" fontSize="1.5rem">+</Text>
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

                <Text fontSize="lg" color="white" mb={2}>
                    Channels
                </Text>
                <VStack align="stretch" spacing={2}>
                    {teams
                        .find((team) => team.id === activeTeamId)
                        ?.channels?.map((channel) => (
                            <Button
                                key={channel.id}
                                variant="outline"
                                colorScheme="teal"
                                onClick={() => setActiveChannelId(channel.id)}
                                width="100%"
                                border="1px solid"
                                borderColor={channel.id === activeChannelId ? "blue.500" : "gray.600"}
                                bg={channel.id === activeChannelId ? "gray.700" : "gray.800"}
                                _hover={{ bg: "gray.600" }}
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
                    colorScheme="teal"
                    mt={4}
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
                            _placeholder={{ color: "gray.400" }}
                        />
                        <Button
                            onClick={handleCreateChannelSubmit}
                            width="100%"
                            variant="solid"
                            colorScheme="teal"
                            mb={2}
                        >
                            Create
                        </Button>
                        <Button
                            onClick={handleCreateChannelCancel}
                            width="100%"
                            variant="outline"
                            colorScheme="gray"
                        >
                            Cancel
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Right Panel with Chat */}
            <Box className="chatContainer" bg="gray.700">
                {activeTeamId && activeChannelId && (
                    <Box className="chatWrapper">
                        <Chat teamId={activeTeamId} channelId={activeChannelId} />
                    </Box>
                )}
            </Box>

            {/* Bottom-right UserInfo component */}
            <UserInfo />
        </div>
    );
}
