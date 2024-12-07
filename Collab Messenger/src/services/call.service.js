import { db } from "../config/firebase.config";
import { push, ref, set, onChildChanged } from "firebase/database";

export const startCall = async (callerId, calleeId) => {
    const callRef = ref(db, `calls/${calleeId}`);
    const newCallRef = push(callRef);

    await set(newCallRef, {
        callerId: callerId,
        calleeId: calleeId,
        offer: true,
        createdAt: new Date().toISOString(),
    });

    console.log(`Call offer sent to ${calleeId}`);
};

export const listenForIncomingCalls = (userId, callback) => {
    const callsRef = ref(db, `calls/`);
    onChildChanged(callsRef, (snapshot) => {
        const callData = snapshot.val();
        if (callData && callData.calleeId === userId && callData.status === "incoming") {
            callback(callData);
        }
    });
};

export const acceptCall = async (callId) => {
    const callRef = ref(db, `calls/${callId}`);
    await set(callRef, {
        answer: true,
        status: 'answered',
        answeredAt: new Date().toISOString(),
    });

    console.log(`Call answered by ${callId}`);
};
