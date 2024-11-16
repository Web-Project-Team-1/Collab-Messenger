import { Box, Text, VStack, Input, Button, Spinner } from '@chakra-ui/react';
import Chat from '../Chat/Chat';
import useTeamPage from '../../components/TeamPage/useTeamPage';
import './TeamPageLayout.css';

export default function TeamPageLayout() {
    const {
        teams,
        newTeamName,
        setNewTeamName,
        inviteUsername,
        setInviteUsername,
        activeTeamId,
        setActiveTeamId,
        isCreatingTeam,
        handleCreateTeam,
        handleInviteUser,
    } = useTeamPage();

    return (
        <div className="teamPageContainer">
            <Box className="sidebar" p={4} bg="gray.800" borderRight="1px" borderColor="gray.700">
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
                        >
                            {team.name}
                        </Button>
                    ))}
                </VStack>

                {/* Create Team Section */}
                <Box mt={4}>
                    <Input
                        type="text"
                        placeholder="Team Name"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        mb={2}
                        bg="gray.700"
                        color="white"
                        _placeholder={{ color: 'gray.400' }}
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

                {/* Invite User Section */}
                <Box mt={4}>
                    <Input
                        type="text"
                        placeholder="Invite by username"
                        value={inviteUsername}
                        onChange={(e) => setInviteUsername(e.target.value)}
                        mb={2}
                        bg="gray.700"
                        color="white"
                        _placeholder={{ color: 'gray.400' }}
                    />
                    <Button
                        onClick={handleInviteUser}
                        width="100%"
                        variant="solid"
                        colorScheme="teal"
                    >
                        Invite User
                    </Button>
                </Box>
            </Box>

            {/* Right Panel with Chat */}
            <Box className="chatContainer" bg="gray.700">
                {activeTeamId && (
                    <Box className="chatWrapper">
                        <Chat teamId={activeTeamId} />
                    </Box>
                )}
            </Box>
        </div>
    );
}
