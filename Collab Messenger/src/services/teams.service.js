import { ref, set, push, get, update } from 'firebase/database';
import { db } from '../config/firebase.config';
import { CHANNEL_NAME_MIN_LENGTH, CHANNEL_NAME_MAX_LENGTH } from '../common/constants';
import { TEAM_NAME_MIN_LENGTH, TEAM_NAME_MAX_LENGTH } from '../common/constants';


export const createTeam = async (teamName, ownerId) => {
    if (!teamName || !ownerId) {
        throw new Error("Team name and owner ID are required.");
    }

    if (teamName.length < TEAM_NAME_MIN_LENGTH || teamName.length > TEAM_NAME_MAX_LENGTH) {
        throw new Error(
            `Team name must be between ${TEAM_NAME_MIN_LENGTH} and ${TEAM_NAME_MAX_LENGTH} characters.`
        );
    }

    const newTeamRef = push(ref(db, 'teams'));
    const teamData = {
        id: newTeamRef.key,
        name: teamName,
        owner: ownerId,
        members: { [ownerId]: true },
        channels: {}
    };

    await set(newTeamRef, teamData);

    const generalChannelRef = push(ref(db, `teams/${newTeamRef.key}/channels`));
    const channelData = {
        id: generalChannelRef.key,
        name: "General",
        messages: {}
    };

    await set(generalChannelRef, channelData);

    return newTeamRef.key;
};

export const inviteUserToTeam = async (teamId, username) => {
    const userRef = ref(db, `users/${username}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
        const userData = snapshot.val();
        const updates = {};
        updates[`teams/${teamId}/members/${userData.uid}`] = true;

        await update(ref(db), updates);
        return userData;
    } else {
        throw new Error("User not found.");
    }
};

export const createChannel = async (teamId, channelName) => {
    if (!teamId || !channelName) {
        throw new Error("Team ID and channel name are required.");
    }

    if (channelName.length < CHANNEL_NAME_MIN_LENGTH || channelName.length > CHANNEL_NAME_MAX_LENGTH) {
        throw new Error(
            `Channel name must be between ${CHANNEL_NAME_MIN_LENGTH} and ${CHANNEL_NAME_MAX_LENGTH} characters.`
        );
    }

    const channelRef = push(ref(db, `teams/${teamId}/channels`));
    const channelData = {
        id: channelRef.key,
        name: channelName,
        messages: {}
    };

    await set(channelRef, channelData);
    return channelRef.key;
};
