import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../config/firebase.config';
import { getUserData } from '../../services/users.service';
import defaultProfilePicture from "../../resources/defaultProfilePicture.png";
import { Box, Text, Button, Input, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import './TeamMembers.css';

export default function TeamMembers({ teamId }) {
    const [teamMembers, setTeamMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showMemberOverlay, setShowMemberOverlay] = useState(false);
    const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0 });
    const [searchTerm, setSearchTerm] = useState('');
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
                                phone: userData.phone || userData.telephone
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
                phone: userData.phone || userData.telephone
            });
            setShowMemberOverlay(true);

            const elementRect = event.target.getBoundingClientRect();
            setOverlayPosition({
                top: elementRect.top + window.scrollY + 30,
                left: elementRect.left + window.scrollX - 20,
            });
        }
    };

    const handleSendMessage = () => {
        navigate('/personal-chats', { state: { receiverId: selectedMember.id } });
        setShowMemberOverlay(false);
    };

    const handleOverlayClose = () => {
        setShowMemberOverlay(false);
        setSelectedMember(null);
    };

    const filteredMembers = teamMembers.filter((member) =>
        member.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="team-members-container">
            <Box className="membersContainer">
                <Text className="team-members-text">Team Members:</Text>

                <Input
                    placeholder="Search by username"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    bg="gray.700"
                    color="white"
                    _placeholder={{ color: 'gray.400' }}
                    mb={4}
                    size="sm"
                />

                {filteredMembers.length > 0 ? (
                    filteredMembers.map((member, idx) => (
                        <Text
                            key={idx}
                            className="teamMember"
                            onClick={(e) => handleMemberClick(member.id, e)}
                            style={{ cursor: 'pointer' }}
                        >
                            {member.username}
                        </Text>
                    ))
                ) : (
                    <Text>No members found</Text>
                )}
            </Box>

            {showMemberOverlay && selectedMember && (
                <Box
                    className="memberDetailsOverlay"
                    style={{
                        top: `${overlayPosition.top}px`,
                        left: `${overlayPosition.left}px`,
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
                    <Text color="white" mb={2}><b>Email:</b> {selectedMember.email || 'Not provided'}</Text>
                    {selectedMember.firstName && <Text color="white" mb={2}><b>First Name:</b> {selectedMember.firstName}</Text>}
                    {selectedMember.lastName && <Text color="white" mb={2}><b>Last Name:</b> {selectedMember.lastName}</Text>}
                    {selectedMember.phone && <Text color="white" mb={2}><b>Phone:</b> {selectedMember.phone}</Text>}
                    <Button colorScheme="teal" width="100%" onClick={handleSendMessage} mb={2}>
                        Send Message
                    </Button>
                    <Button width="100%" variant="outline" colorScheme="gray" onClick={handleOverlayClose}>
                        Close
                    </Button>
                </Box>
            )}
        </div>
    );
}
