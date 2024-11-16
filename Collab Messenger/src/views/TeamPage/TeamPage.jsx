import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, push, onValue, off } from 'firebase/database';
import { db } from '../../config/firebase.config';
import { AppContext } from '../../store/app.context';
import { Box, Text, VStack, HStack, Input, Button, Flex, Spinner } from '@chakra-ui/react';
import Chat from '../Chat/Chat';

export default function TeamPage() {
    const { user } = useContext(AppContext);
    const [teams, setTeams] = useState([]);
    const [newTeamName, setNewTeamName] = useState('');
    const [inviteUsername, setInviteUsername] = useState('');
    const [activeTeamId, setActiveTeamId] = useState(null);
    const [isCreatingTeam, setIsCreatingTeam] = useState(false);  // Loading state for team creation
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
            const teamsRef = ref(db, 'teams/');
            const listener = (snapshot) => {
                const data = snapshot.val();
                const loadedTeams = data ? Object.keys(data).map(teamId => ({
                    id: teamId,
                    name: data[teamId].name
                })) : [];
                setTeams(loadedTeams);
            };
            onValue(teamsRef, listener);
            return () => off(teamsRef, 'value', listener);
        } catch (error) {
            console.error('Error fetching teams', error);
        }
    };

    const handleCreateTeam = async () => {
        if (!newTeamName) {
            alert('Please provide a team name');
            return;
        }
        setIsCreatingTeam(true);  // Show loading spinner
        try {
            const teamData = {
                name: newTeamName,
                createdBy: user.uid,
                createdAt: Date.now()
            };
            const teamsRef = ref(db, 'teams/');
            const newTeamRef = push(teamsRef);
            await newTeamRef.set(teamData);
            setTeams(prevTeams => [...prevTeams, { id: newTeamRef.key, name: newTeamName }]);
            setNewTeamName('');
            setIsCreatingTeam(false);  // Hide loading spinner
        } catch (error) {
            console.error('Error creating team', error);
            alert('Error creating team');
            setIsCreatingTeam(false);
        }
    };

    const handleInviteUser = async () => {
        if (!inviteUsername) {
            alert('Please enter a username');
            return;
        }
        try {
            // Your invite user logic goes here
            setInviteUsername('');
        } catch (error) {
            console.error('Error inviting user', error);
            alert(error.message);
        }
    };

    return (
        <Flex direction="row" w="100%" h="100vh">
            <Box width="300px" p={4} bg="gray.800" borderRight="1px" borderColor="gray.200" flexShrink="0">
                <Text fontSize="2xl" mb={4} color="white">Teams</Text>
                <VStack align="stretch" spacing={3}>
                    {teams.map((team) => (
                        <Button
                            key={team.id}
                            variant="outline"
                            colorScheme="teal"
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
                        bg="gray.700"
                        color="white"
                        _placeholder={{ color: "gray.400" }}
                    />
                    <Button
                        onClick={handleCreateTeam}
                        width="100%"
                        variant="solid"
                        colorScheme="blue"
                        disabled={isCreatingTeam}
                    >
                        {isCreatingTeam ? <Spinner size="sm" /> : 'Create Team'}
                    </Button>
                </Box>
            </Box>

            <Box flex="1" p={4} display="flex" justifyContent="start" alignItems="center" bg="gray.700">
                {activeTeamId && (
                    <>
                        <Box w="80%" maxW="800px">
                            <Chat teamId={activeTeamId} />
                            <Box mt={4}>
                                <Input
                                width='163%'
                                    type="text"
                                    placeholder="Invite by username"
                                    value={inviteUsername}
                                    onChange={(e) => setInviteUsername(e.target.value)}
                                    mb={2}
                                    bg="gray.600"
                                    color="white"
                                    _placeholder={{ color: "gray.400" }}
                                />
                                <Button
                                    onClick={handleInviteUser}
                                    width="163%"
                                    variant="solid"
                                    colorScheme="teal"
                                >
                                    Invite User
                                </Button>
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
        </Flex>
    );
}
