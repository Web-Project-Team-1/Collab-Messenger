import { ref, set, push, get } from 'firebase/database';
import { db } from '../config/firebase.config';

export const createTeam = async (teamName, ownerId) => {
    if (!teamName || !ownerId) {
        throw new Error("Team name and owner ID are required.");
    }

    const newTeamRef = push(ref(db, 'teams'));

    const teamData = {
        id: newTeamRef.key,
        name: teamName,
        owner: ownerId,
        members: { [ownerId]: true },
        channels: []
    };

    await set(newTeamRef, teamData);
    return newTeamRef.key;
};

export const getAllTeams = async () => {
    const snapshot = await get(ref(db, 'teams'));
    return snapshot.val();
};
