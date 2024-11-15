import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../store/app.context';
import { createTeam, getAllTeams } from '../../services/teams.service';

export default function TeamPage() {
    const [teams, setTeams] = useState([]);
    const [newTeamName, setNewTeamName] = useState('');
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

    return (
        <div className="team-page">
            <div className="team-sidebar">
                <h2>Teams</h2>
                <div className="team-list">
                    {teams.map(team => (
                        <div key={team.id} className="team-item">
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
            </div>
        </div>
    );
}
