import { ref, set, push, get, update } from 'firebase/database';
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

    const channelRef = push(ref(db, `teams/${teamId}/channels`));
    const channelData = {
        id: channelRef.key,
        name: channelName,
        messages: {}
    };

    await set(channelRef, channelData);
    return channelRef.key;
};

export const fetchTeamMembers = async (teamId) => {
    try {
        const teamRef = ref(db, `teams/${teamId}`);
        const snapshot = await get(teamRef);
        
        if (snapshot.exists()) {
            const teamData = snapshot.val();
            const teamMembers = {}; // Object to hold members

            // Iterate through channels
            const channels = teamData.channels || {};

            for (let channelId in channels) {
                const channel = channels[channelId];

                // Fetch the owner from the channel data
                const ownerId = channel.owner;
                
                // If the owner is not already added to teamMembers, add them
                if (ownerId && !teamMembers[ownerId]) {
                    const ownerRef = ref(db, `users/${ownerId}`);
                    const ownerSnapshot = await get(ownerRef);
                    if (ownerSnapshot.exists()) {
                        const ownerData = ownerSnapshot.val();
                        teamMembers[ownerId] = {
                            ...ownerData,
                            isOwner: true, // Mark as the owner
                        };
                    }
                }

                // Fetch the members from the channel and add them to teamMembers
                const channelMembers = channel.members || {};
                for (let memberId in channelMembers) {
                    // Avoid adding the owner twice
                    if (!teamMembers[memberId]) {
                        const memberRef = ref(db, `users/${memberId}`);
                        const memberSnapshot = await get(memberRef);
                        if (memberSnapshot.exists()) {
                            const memberData = memberSnapshot.val();
                            teamMembers[memberId] = {
                                ...memberData,
                                isOwner: false, // Mark as regular member
                            };
                        }
                    }
                }
            }

            return teamMembers;
        } else {
            throw new Error("No team found");
        }
    } catch (error) {
        console.error("Error fetching team members:", error);
        throw error;
    }
};


// Function to fetch member details from the 'users' collection
export const getUserDetails = async (userId) => {
    const userRef = ref(db, `users/${userId}`);

    try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            return snapshot.val(); // This returns the user data (name, avatar, etc.)
        } else {
            throw new Error("User data not found.");
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null;
    }
};