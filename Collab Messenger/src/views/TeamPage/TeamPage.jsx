import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../store/app.context';
import { createTeam, getAllTeams, inviteUserToTeam } from '../../services/teams.service';
import { Box, Text, Input, Button, VStack } from '@chakra-ui/react';
import Chat from '../Chat/Chat';
import { Flex } from '@chakra-ui/react';

export default function TeamPage() {
    const [teams, setTeams] = useState([]);
    const [newTeamName, setNewTeamName] = useState('');
    const [inviteUsername, setInviteUsername] = useState('');
    const [activeTeamId, setActiveTeamId] = useState(null);
    const { user } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchTeams();
        }
    }, [user, navigate]);

    const fetchTeams = async () => {
        try {
            const teamsData = await getAllTeams();
            const teamsList = Object.keys(teamsData || {}).map(teamId => ({
                id: teamId,
                ...teamsData[teamId],
            }));
            setTeams(teamsList);
        } catch (error) {
            console.error('Error fetching teams', error);
        }
    };

    const handleCreateTeam = async () => {
        if (!newTeamName) {
            alert('Please provide a team name');
            return;
        }
        try {
            await createTeam(newTeamName, user.uid);
            setNewTeamName('');
            fetchTeams();
        } catch (error) {
            console.error('Error creating team', error);
        }
    };

    const handleInviteUser = async () => {
        if (!inviteUsername) {
            alert('Please enter a username');
            return;
        }
        try {
            await inviteUserToTeam(activeTeamId, inviteUsername);
            setInviteUsername('');
        } catch (error) {
            console.error('Error inviting user', error);
            alert(error.message);
        }
    };

    return (
        <Flex direction="row" w='100%' h='100vh'>
            <Box width="300px" borderRight="1px" borderColor="gray.200" p={4} flexShrink="0">
                <Text fontSize="2xl" mb={4}>Teams</Text>
                <VStack align="stretch" spacing={3}>
                    {teams.map((team) => (
                        <Button
                            key={team.id}
                            variant="surface"
                            onClick={() => setActiveTeamId(team.id)}
                            width="100%"
                        >
                            {team.name}
                        </Button>
                    ))}
                </VStack>
                <Box mt={4}>
                    <Input
                        type="text"
                        placeholder="Team Name"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        mb={2}
                    />
                    <Button onClick={handleCreateTeam} width="100%" variant='surface'>Create Team</Button>
                </Box>
            </Box>

            <Box flex="1" p={4} display="flex" justifyContent="center" alignItems="center">
                {activeTeamId && (
                    <>
                        <Text fontSize="2xl" mb={4}>Team Chat</Text>
                        <Box w="80%" maxW="800px">
                            <Chat teamId={activeTeamId} />
                            <Box mt={4}>
                                <Input
                                    type="text"
                                    placeholder="Invite by username"
                                    value={inviteUsername}
                                    onChange={(e) => setInviteUsername(e.target.value)}
                                    mb={2}
                                />
                                <Button onClick={handleInviteUser} width="100%" variant='surface'>Invite User</Button>
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
        </Flex>
    );
}
