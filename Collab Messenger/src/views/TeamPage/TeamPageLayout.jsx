import { Box, Text, VStack, Button, Input, Spinner } from "@chakra-ui/react";
import Chat from "../Chat/Chat";
import useTeamPage from "../../components/TeamPage/useTeamPage";
import UserInfo from "../../components/UserInfo/UserInfo";
import { act, useState } from "react";
import { useEffect } from "react";
import Channels from "../Channels/Channels";
import "./TeamPageLayout.css";
import TeamMembers from "../TeamMembers/TeamMembers";

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

    const handleCreateTeamClick = () => setShowCreateTeamInput(true);
    const handleCreateTeamCancel = () => {
        setShowCreateTeamInput(false);
        setNewTeamName("");
    };
    const handleCreateTeamSubmit = () => {
        handleCreateTeam();
        setShowCreateTeamInput(false);
    };
    const setActiveTeamIdWithDefaultChannel = (teamId) => {
        setActiveTeamId(teamId);
        const selectedTeam = teams.find((team) => team.id === teamId);
        if (selectedTeam && selectedTeam.channels.length > 0) {
            const generalChannel = selectedTeam.channels.find(
                (channel) => channel.name.toLowerCase() === "general"
            );
            setActiveChannelId(generalChannel ? generalChannel.id : selectedTeam.channels[0].id);
        } else {
            setActiveChannelId(null); 
        }
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
                            onClick={() => setActiveTeamIdWithDefaultChannel(team.id)}
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
            <Channels
                teams={teams}
                activeTeamId={activeTeamId}
                activeChannelId={activeChannelId}
                setActiveChannelId={setActiveChannelId}
                newChannelName={newChannelName}
                setNewChannelName={setNewChannelName}
                handleCreateChannel={handleCreateChannel}
                showCreateChannelInput={showCreateChannelInput}
                setShowCreateChannelInput={setShowCreateChannelInput}
                inviteUsername={inviteUsername}
                setInviteUsername={setInviteUsername}
                showInviteUserInput={showInviteUserInput}
                setShowInviteUserInput={setShowInviteUserInput}
                handleInviteUser={handleInviteUser}
            />

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
            
            {/* Right Panel with Team Members */}
            <Box className="members" bg="gray.700">
                {activeTeamId && (
                    <Box className="membersWrapper">
                        <TeamMembers teamId={activeTeamId} />
                    </Box>
                )}
            </Box>
           
        </div>
    );
}
