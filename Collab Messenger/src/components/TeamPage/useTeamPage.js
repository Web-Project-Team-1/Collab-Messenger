import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, push, onValue, off } from 'firebase/database';
import { db } from '../../config/firebase.config';
import { AppContext } from '../../store/app.context';

export default function useTeamPage() {
    const { user } = useContext(AppContext);
    const [teams, setTeams] = useState([]);
    const [newTeamName, setNewTeamName] = useState('');
    const [inviteUsername, setInviteUsername] = useState('');
    const [activeTeamId, setActiveTeamId] = useState(null);
    const [isCreatingTeam, setIsCreatingTeam] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchTeams();
        }
    }, [user, navigate]);

    const fetchTeams = async () => {
        const teamsRef = ref(db, 'teams/');
        const listener = (snapshot) => {
            const data = snapshot.val();
            const loadedTeams = data
                ? Object.keys(data).map((teamId) => ({
                      id: teamId,
                      name: data[teamId].name,
                  }))
                : [];
            setTeams(loadedTeams);
        };
        onValue(teamsRef, listener);
        return () => off(teamsRef, 'value', listener);
    };

    const handleCreateTeam = async () => {
        if (!newTeamName) {
            alert('Please provide a team name');
            return;
        }
        setIsCreatingTeam(true);
        try {
            const teamData = {
                name: newTeamName,
                createdBy: user.uid,
                createdAt: Date.now(),
            };
            const teamsRef = ref(db, 'teams/');
            const newTeamRef = push(teamsRef);
            await newTeamRef.set(teamData);
            setTeams((prevTeams) => [
                ...prevTeams,
                { id: newTeamRef.key, name: newTeamName },
            ]);
            setNewTeamName('');
            setIsCreatingTeam(false);
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
        setInviteUsername('');
    };

    return {
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
    };
}
