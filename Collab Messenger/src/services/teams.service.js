import { ref, set, push, get, update} from 'firebase/database';
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

export const inviteUserToTeam = async (teamId, username) => {
    const userRef = ref(db, `users/${username}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
        const userData = snapshot.val();
        const updates = {};
        updates[`teams/${teamId}/teamMembers/${userData.uid}`] = true;
        
        await update(ref(db), updates);
        return userData;
    } else {
        throw new Error("User not found.");
    }
};
