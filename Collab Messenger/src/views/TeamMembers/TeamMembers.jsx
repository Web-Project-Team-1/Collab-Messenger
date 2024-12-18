import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../../config/firebase.config";
import { getUserData } from "../../services/users.service";
import defaultProfilePicture from "../../resources/defaultProfilePicture.png";
import { Box, Text, Button, Input, Image } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import calendarIcon from "../../resources/calendar.png";
import chatIcon from "../../resources/openai-icon.png"
import Calendar from "../Calendar/Calendar";
import ChatWithGPT from "../ChatWithGPT/ChatWithGPT";
import "./TeamMembers.css";
import { auth } from "../../config/firebase.config";
import { onAuthStateChanged } from "firebase/auth";

export default function TeamMembers({ teamId }) {
    const [teamMembers, setTeamMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showMemberOverlay, setShowMemberOverlay] = useState(false);
    const [showAllMembers, setShowAllMembers] = useState(false);
    const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0 });
    const [searchTerm, setSearchTerm] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);
    const [showChatGPT, setShowChatGPT] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

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

    const toggleChatGPT = () => {
        setShowChatGPT((prev) => !prev);
    };

    const toggleCalendar = () => setShowCalendar((prev) => !prev);

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
                            background: "rgba(0, 0, 0)",
                            right: "50px",
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

                        {/* Send Message Button */}
                        <Button
                            width="100%"
                            onClick={handleSendMessage}
                            mb={2}
                            variant="solid"
                            colorScheme="blue"
                            mt={4}
                            _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
                            _focus={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}
                            _active={{ bg: "blue.800" }}
                            transition="all 0.3s ease-in-out"
                            borderRadius="30px"
                        >
                            Send Message
                        </Button>

                        {/* Close Button */}
                        <Button
                            width="100%"
                            variant="solid"
                            colorScheme="blue"
                            mt={4}
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
                        position="absolute"
                        top="45%"
                        left="80%"
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
                {/* Calendar and ChatGPT Icons */}
                <Box display="flex" alignItems="center" mt={20} p={2} borderRadius="md" className="icon-container" >
                    {/* Calendar Icon */}
                    <Box onClick={toggleCalendar} cursor="pointer" ml={4}>
                        <img src={calendarIcon} width={50} alt="Calendar icon" className="icon" />
                    </Box>

                    {/* ChatGPT Icon */}
                    <Box onClick={toggleChatGPT} cursor="pointer" ml={4}>
                        <img src={chatIcon} width={50} alt="ChatGPT icon" className="icon" />
                    </Box>
                </Box>

                {/* Calendar Box */}
                {showCalendar && (
                    <Box
                        mt={33}
                        className="calendarBox"
                        position="absolute"
                        top="10%"
                        left="50%"
                        transform="translate(-50%, 0)"
                        bg="gray.900"
                        p={5}
                        borderRadius="12px"
                        boxShadow="0 6px 12px rgba(0, 0, 0, 0.2)"
                        zIndex={1000}
                    >
                        <Text fontSize="23px" fontWeight="bold" color="white" mb={4} mt={4} textAlign="center">
                            Team Calendar
                        </Text>
                        <Calendar />
                        <Button
                            mt={4}
                            colorScheme="red"
                            onClick={toggleCalendar}
                            size="sm"
                            borderRadius="md"
                            textAlign="center"
                            display="block"
                            mx="auto"
                        >
                            Close
                        </Button>
                    </Box>
                )}

                {showChatGPT && (
                    <Box
                        position="fixed"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        zIndex={1000}
                        bg="gray"
                        borderRadius="8px"
                        boxShadow="0 4px 12px rgba(0, 0, 0, 0.3)"
                        p={6}
                        maxWidth="90%"
                    >
                        <ChatWithGPT />
                        <Button className="CloseButtonChatGpt"
                            onClick={toggleChatGPT}
                            mt={4}
                            width="100%"
                        >
                            Close
                        </Button>
                    </Box>
                )}
            </div>
        </div >
    );
}
