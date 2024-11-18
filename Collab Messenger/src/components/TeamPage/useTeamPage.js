import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, push, onValue, off, get } from 'firebase/database';
import { db } from '../../config/firebase.config';
import { AppContext } from '../../store/app.context';
import { createTeam, inviteUserToTeam, createChannel } from '../../services/teams.service';
import { getUserData } from '../../services/users.service';

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
        const listener = async (snapshot) => {
            const data = snapshot.val();
            const userTeams = data
                ? await Promise.all(
                    Object.keys(data)
                        .filter((teamId) => data[teamId]?.members?.[user.uid]) 
                        .map(async (teamId) => {
                            const team = data[teamId];
                            const memberUsernames = await Promise.all(
                                Object.keys(team.members).map(async (memberId) => {
                                    const memberData = await getUserData(memberId);
                                    return memberData ? memberData.username : memberId; 
                                })
                            );
                            return {
                                id: teamId,
                                name: team.name,
                                channels: team.channels ? Object.keys(team.channels).map((channelId) => ({
                                    id: channelId,
                                    name: team.channels[channelId].name,
                                })) : [],
                                members: memberUsernames, 
                            };
                        })
                )
                : [];
            setTeams(userTeams); 
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