import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../../config/firebase.config";
import { getUserData } from "../../services/users.service";
import defaultProfilePicture from "../../resources/defaultProfilePicture.png";
import { Box, Text, Button, Input, Image } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import calendarIcon from "../../resources/calendar.png";
import "./TeamMembers.css";

export default function TeamMembers({ teamId }) {
    const [teamMembers, setTeamMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showMemberOverlay, setShowMemberOverlay] = useState(false);
    const [showAllMembers, setShowAllMembers] = useState(false);
    const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0 });
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

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
                        return userData
                            ? {
                                id: memberId,
                                username: userData.username,
                                email: userData.email,
                                phone: userData.phone || userData.telephone,
                            }
                            : { id: memberId, username: memberId };
                    })
                );
                setTeamMembers(memberUsernames);
            }
        };

        fetchTeamMembers();
    }, [teamId]);

    const handleMemberClick = async (memberId, event) => {
        const userData = await getUserData(memberId);
        if (userData) {
            setSelectedMember({
                id: memberId,
                ...userData,
                photoURL: userData.photoURL || defaultProfilePicture,
                phone: userData.phone || userData.telephone,
            });
            setShowMemberOverlay(true);

            const elementRect = event.target.getBoundingClientRect();
            setOverlayPosition({
                top: elementRect.top + window.scrollY - 50,
                left: elementRect.left + window.scrollX - 20,
            });
        }
    };

    const handleSendMessage = () => {
        navigate("/personal-chats", { state: { receiverId: selectedMember.id } });
        setShowMemberOverlay(false);
    };

    const handleOverlayClose = () => {
        setShowMemberOverlay(false);
        setSelectedMember(null);
    };

    const filteredMembers = teamMembers.filter((member) =>
        member.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewAllClick = () => {
        setShowAllMembers(true);
    };

    const handleCloseAllMembers = () => {
        setShowAllMembers(false);
    };

    const openCalendar = () => {
        navigate("/calendar");
    };

    return (
        <div className="members">
            <div className="team-members-container">
                <Box className="membersContainer">
                    <Text className="team-members-text" textAlign="center">Team Members:</Text>

                    <Input
                        placeholder="Search by username"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        bg="gray.700"
                        color="white"
                        _placeholder={{ color: "gray.400" }}
                        mb={4}
                        size="sm"
                    />

                    {filteredMembers.slice(0, 3).map((member, idx) => (
                        <Text
                            key={idx}
                            className="teamMember"
                            onClick={(e) => handleMemberClick(member.id, e)}
                            style={{ cursor: "pointer" }}
                        >
                            {member.username}
                        </Text>
                    ))}

                    {teamMembers.length > 3 && (
                        <Button
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
                            onClick={handleViewAllClick}
                        >
                            View All Members
                        </Button>
                    )}
                </Box>

                {showMemberOverlay && selectedMember && (
                    <Box
                        className="memberDetailsOverlay"
                        style={{
                            top: `${overlayPosition.top}px`,
                            left: `${overlayPosition.left}px`,
                            position: "absolute",
                            zIndex: 1001,
                            background: "rgba(0, 0, 0, 0.8)",
                            padding: "20px",
                            borderRadius: "8px",
                            width: "200px",
                            color: "white",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                        }}
                    >
                        <Box display="flex" alignItems="center" mb={2}>
                            <Image
                                boxSize="50px"
                                borderRadius="full"
                                src={selectedMember.photoURL}
                                alt="User Profile"
                                mr={3}
                            />
                            <Text fontSize="lg" fontWeight="bold" color="white">
                                {selectedMember.username}
                            </Text>
                        </Box>
                        <Text color="white" mb={2}>
                            <b>Email:</b> {selectedMember.email || "Not provided"}
                        </Text>
                        {selectedMember.firstName && (
                            <Text color="white" mb={2}>
                                <b>First Name:</b> {selectedMember.firstName}
                            </Text>
                        )}
                        {selectedMember.lastName && (
                            <Text color="white" mb={2}>
                                <b>Last Name:</b> {selectedMember.lastName}
                            </Text>
                        )}
                        {selectedMember.phone && (
                            <Text color="white" mb={2}>
                                <b>Phone:</b> {selectedMember.phone}
                            </Text>
                        )}
                        <Button width="100%" onClick={handleSendMessage} mb={2}
                            variant="solid"
                            colorScheme="blue"
                            mt={4}
                            leftIcon={<FaPlus />}
                            _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
                            _focus={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}
                            _active={{ bg: "blue.800" }}
                            transition="all 0.3s ease-in-out"
                            borderRadius="30px" >
                            Send Message
                        </Button>
                        <Button
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
                            onClick={handleOverlayClose}
                        >
                            Close
                        </Button>
                    </Box>
                )}

                {showAllMembers && (
                    <Box
                        position="fixed"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        bg="gray.800"
                        color="white"
                        p={6}
                        borderRadius="8px"
                        boxShadow="0 4px 12px rgba(0,0,0,0.3)"
                        zIndex={1000}
                        maxWidth="90%"
                        maxHeight="80%"
                        overflowY="auto"
                    >
                        <Text fontSize="lg" fontWeight="bold" mb={4}>
                            All Team Members
                        </Text>
                        {filteredMembers.map((member, idx) => (
                            <Box
                                key={idx}
                                className="teamMember"
                                mb={2}
                                p={2}
                                onClick={(e) => handleMemberClick(member.id, e)}
                                cursor="pointer"
                            >
                                {member.username}
                            </Box>
                        ))}
                        <Button
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
                            onClick={handleCloseAllMembers}
                        >
                            Close
                        </Button>
                    </Box>
                )}
                <Box
                    display="flex"
                    alignItems="center"
                    mt={20}
                    p={2}
                    borderRadius="md"
                    className="calendar-icon-container"
                    position="relative"
                >
                    <NavLink
                        to="/calendar"
                        className={({ isActive }) => (isActive ? "active-link" : "")}
                    >
                        <img
                            src={calendarIcon}
                            alt="Calendar icon"
                            className="calendar-icon"
                        />
                    </NavLink>
                    <Text className="calendar-tooltip">Calendar</Text>
                </Box>
            </div>
        </div>
    );
}
