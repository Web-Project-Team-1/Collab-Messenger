import { ref, get, update } from "firebase/database";
import { db } from "../../config/firebase.config";

export default async function leaveTeam(userId, teamId) {
    try {
        const teamRef = ref(db, `teams/${teamId}`);
        const teamSnapshot = await get(teamRef);

        if (teamSnapshot.exists()) {
            const teamData = teamSnapshot.val();

            const updatedTeamMembers = teamData.members.filter(member => member !== userId);
            await update(ref(db, `teams/${teamId}`), {
                members: updatedTeamMembers,
            });

            const channelUpdates = {};
            for (const channelId in teamData.channels) {
                const channelMembers = teamData.channels[channelId].members;
                const updatedChannelMembers = channelMembers.filter(member => member !== userId);
                channelUpdates[`channels/${channelId}/members`] = updatedChannelMembers;
            }
            await update(teamRef, channelUpdates);

            console.log("User successfully left the team and all its channels");
        } else {
            throw new Error("Team does not exist.");
        }
    } catch (error) {
        console.error("Error leaving team:", error.message);
    }
}
