import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../store/app.context';
import { createTeam, getAllTeams, inviteUserToTeam } from '../../services/teams.service';
import Chat from '../Chat/Chat';

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
        <div className="team-page">
            <div className="team-sidebar">
                <h2>Teams</h2>
                <div className="team-list">
                    {teams.map(team => (
                        <div
                            key={team.id}
                            className="team-item"
                            onClick={() => setActiveTeamId(team.id)}
                        >
                            {team.name}
                        </div>
                    ))}
                </div>
                <div className="create-team">
                    <input
                        type="text"
                        placeholder="Team Name"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                    />
                    <button onClick={handleCreateTeam}>Create Team</button>
                </div>
            </div>
            <div className="team-content">
                {activeTeamId && (
                    <>
                        <h2>Team Chat</h2>
                        <Chat teamId={activeTeamId} />
                        <div className="invite-user">
                            <input
                                type="text"
                                placeholder="Invite by username"
                                value={inviteUsername}
                                onChange={(e) => setInviteUsername(e.target.value)}
                            />
                            <button onClick={handleInviteUser}>Invite User</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
