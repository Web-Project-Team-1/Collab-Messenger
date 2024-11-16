import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, push, onValue, off } from 'firebase/database';
import { db } from '../../config/firebase.config';
import { AppContext } from '../../store/app.context';
import { createTeam, inviteUserToTeam, createChannel } from '../../services/teams.service';

export default function useTeamPage() {
    const { user } = useContext(AppContext);
    const [teams, setTeams] = useState([]);
    const [newTeamName, setNewTeamName] = useState('');
    const [inviteUsername, setInviteUsername] = useState('');
    const [activeTeamId, setActiveTeamId] = useState(null);
    const [activeChannelId, setActiveChannelId] = useState(null);
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
                      channels: data[teamId].channels ? Object.keys(data[teamId].channels).map(channelId => ({
                          id: channelId,
                          name: data[teamId].channels[channelId].name
                      })) : []
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
            const teamId = await createTeam(newTeamName, user.uid);
            fetchTeams();
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
        try {
            await inviteUserToTeam(activeTeamId, inviteUsername);
            setInviteUsername('');
        } catch (error) {
            console.error('Error inviting user', error);
            alert('Error inviting user');
        }
    };

    const handleCreateChannel = async (teamId, channelName, clearChannelInput) => {
        if (!channelName) {
            alert('Please provide a channel name');
            return;
        }
        try {
            await createChannel(teamId, channelName);
            clearChannelInput('');
        } catch (error) {
            console.error('Error creating channel', error);
            alert('Error creating channel');
        }
    };

    return {
        teams,
        newTeamName,
        setNewTeamName,
        inviteUsername,
        setInviteUsername,
        activeTeamId,
        setActiveTeamId,
        activeChannelId,
        setActiveChannelId,
        isCreatingTeam,
        handleCreateTeam,
        handleInviteUser,
        handleCreateChannel
    };
}
