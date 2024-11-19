import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../config/firebase.config';
import { getUserData } from '../../services/users.service';
import { Box, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import './TeamMembers.css';

export default function TeamMembers({ teamId }) {
    const [teamMembers, setTeamMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showMemberOverlay, setShowMemberOverlay] = useState(false);
    const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0 });
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
                            ? { id: memberId, username: userData.username, email: userData.email }
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
            setSelectedMember({ id: memberId, ...userData });
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

    return (
        <div className="team-members-container">
            <Box className="membersContainer">
                <Text className="team-members-text">Team Members:</Text>
                {teamMembers.length > 0 ? (
                    teamMembers.map((member, idx) => (
                        <Text
                            key={idx}
                            className="teamMember"
                            onClick={(e) => handleMemberClick(member.id, e)}
                            style={{ cursor: 'pointer', color: 'white' }}
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
                    <Text fontSize="lg" fontWeight="bold" color="white" mb={2}>
                        {selectedMember.username}
                    </Text>
                    <Text color="white" mb={2}><b>Email:</b> {selectedMember.email || 'Not provided'}</Text>
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
