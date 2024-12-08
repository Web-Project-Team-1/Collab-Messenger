import { Box, Text, VStack, Button, Input } from "@chakra-ui/react";
import Chat from "../Chat/Chat";
import useTeamPage from "../../components/TeamPage/useTeamPage";
import UserInfo from "../../components/UserInfo/UserInfo";
import Channels from "../Channels/Channels";
import "./TeamPageLayout.css";
import TeamMembers from "../TeamMembers/TeamMembers";
import { FaPlus, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import dms from "../../resources/dms.png";
import { db } from "../../config/firebase.config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { get, ref, set, update } from "firebase/database";

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

    const setActiveTeamIdWithDefaultChannel = (teamId) => {
        setActiveTeamId(teamId);

        if (!activeChannelId) {
            const selectedTeam = teams.find((team) => team.id === teamId);
            if (selectedTeam && selectedTeam.channels.length > 0) {
                const generalChannel = selectedTeam.channels.find(
                    (channel) => channel.name.toLowerCase() === "general"
                );
                setActiveChannelId(generalChannel ? generalChannel.id : selectedTeam.channels[0].id);
            } else {
                setActiveChannelId(null);
            }
        }
    };

    useEffect(() => {
        if (teams.length > 0 && !activeTeamId) {
            setActiveTeamIdWithDefaultChannel(teams[0].id);
        }
    }, [teams, activeTeamId]);

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

    async function handleUpdateChannelName(teamId, channelId, newChannelName) {
        try {
            if (!teamId || !channelId || !newChannelName) {
                throw new Error("Invalid input: Missing teamId, channelId, or newChannelName.");
            }

            const channelRef = ref(db, `teams/${teamId}/channels/${channelId}`);

            const channelSnapshot = await get(channelRef);
            if (!channelSnapshot.exists()) {
                throw new Error("Channel not found");
            }

            await update(channelRef, {
                name: newChannelName,
            });

            console.log("Channel name updated successfully");
        } catch (error) {
            console.error("Error updating channel name:", error.message);
        }
    }

    return (
        <div className="teamPageContainer">
            {/* Teams Sidebar */}
            <Box className="sidebar" p={4} bg="gray.900" borderRight="1px solid gray.700">
                {/* DMS Section */}
                <NavLink
                    to="/personal-chats"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                    <Box display="flex" alignItems="center" mt={20} p={2} borderRadius="md" className="direct-messages-container">
                        <img src={dms} alt="Direct Messages" style={{ width: "40px", marginLeft: "25px" }} />
                        <Text className="direct-messages-icon">Direct Messages</Text>
                    </Box>
                </NavLink>

                {/* Teams Section */}
                <Text fontSize="2xl" mb={4} color="white" textAlign="center">
                    Teams
                </Text>
                <VStack align="stretch" spacing={3} className="sidebarButtonContainer">
                    {teams.map((team) => (
                        <Button
                            key={team.id}
                            variant="solid"
                            colorScheme="teal"
                            onClick={() => setActiveTeamIdWithDefaultChannel(team.id)}
                            width="100%"
                            border="1px solid"
                            borderColor={team.id === activeTeamId ? "blue.500" : "gray.600"}
                            bg={team.id === activeTeamId ? "gray.700" : "gray.800"}
                            _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
                            _focus={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}
                            _active={{ bg: "blue.600" }}
                            transition="all 0.3s ease-in-out"
                            leftIcon={<FaPlus />}
                            borderRadius="30px"
                        >
                            {team.name}
                        </Button>
                    ))}
                </VStack>

                {/* Create Team Button */}
                <Button
                    onClick={handleCreateTeamClick}
                    width="100%"
                    variant="outline"
                    colorScheme="blue"
                    mt={4}
                    leftIcon={<FaPlus />}
                    _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
                    _focus={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}
                    _active={{ bg: "blue.800" }}
                    transition="all 0.3s ease-in-out"
                    borderRadius="30px"
                    border={showCreateChannelInput ? "none" : "1px solid"}
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
                            _placeholder={{ color: "blue.400" }}
                            borderRadius="30px"
                        />
                        <Button
                            onClick={handleCreateTeamSubmit}
                            width="100%"
                            variant="solid"
                            colorScheme="blue"
                            mb={2}
                            isLoading={isCreatingTeam}
                            _hover={{ bg: "blue.600" }}
                            _focus={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}
                            _active={{ bg: "blue.800" }}
                            borderRadius="30px"
                        >
                            Create
                        </Button>
                        <Button
                            onClick={handleCreateTeamCancel}
                            width="100%"
                            variant="solid"
                            colorScheme="blue"
                            leftIcon={<FaTimes />}
                            _hover={{ bg: "blue.600" }}
                            _focus={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}
                            _active={{ bg: "blue.700" }}
                            borderRadius="30px"
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
                handleUpdateChannelName={handleUpdateChannelName}
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
