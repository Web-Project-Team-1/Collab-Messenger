import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../config/firebase.config';
import { getUserData } from '../../services/users.service';
import { Box, Text } from '@chakra-ui/react';
import './TeamMembers.css';

export default function TeamMembers({ teamId }) {

    const [teamMembers, setTeamMembers] = useState([]);

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
                        return userData ? userData.username : memberId;  
                    })
                );
                setTeamMembers(memberUsernames);
            }
        };

        fetchTeamMembers();

        return () => setTeamMembers([]);
    }, [teamId]);

    return (
        <div className="team-members-container">
            {/* Display Team Members */}
            <Box className="membersContainer">
                <Text className="team-members-text">Team Members:</Text>
                {teamMembers.length > 0 ? (
                    teamMembers.map((username, idx) => (
                        <Text key={idx} className="teamMember">{username}</Text>
                    ))
                ) : (
                    <Text>No members found</Text>
                )}
            </Box>
        </div>
    );
}