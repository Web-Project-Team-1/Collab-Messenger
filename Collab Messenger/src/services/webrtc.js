import { ref, push, set, onValue } from 'firebase/database';
import { db } from '../config/firebase.config';

export const createRoom = async (callerId, calleeId) => {
  const roomRef = ref(db, 'audioRooms');
  const newRoomRef = push(roomRef);

  await set(newRoomRef, {
    roomId: newRoomRef.key,
    createdAt: new Date().toISOString(),
    members: [callerId, calleeId],
  });

  console.log('Created new room with ID:', newRoomRef.key);
  return newRoomRef.key;
};

export const joinRoom = async (roomId, data) => {
  const roomRef = ref(db, `audioRooms/${roomId}`);
  await set(roomRef, data);
  return roomRef;
};

export const listenForChanges = (roomId, callback) => {
  const roomRef = ref(db, `audioRooms/${roomId}`);
  onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  });
};

export const sendSignal = async (roomId, signalData) => {
  const roomRef = ref(db, `audioRooms/${roomId}/signals`);
  await push(roomRef, signalData);
};

export const listenForSignals = (roomId, callback) => {
  const signalRef = ref(db, `audioRooms/${roomId}/signals`);
  onValue(signalRef, (snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        callback(childSnapshot.val());
      });
    }
  });
};

export const addCallOffer = async (callerId, calleeId) => {
  const roomId = await createRoom(callerId, calleeId);
  const offer = {
    type: 'offer',
    callerId: callerId,
    calleeId: calleeId,
    createdAt: new Date().toISOString(),
  };

  await sendSignal(roomId, offer);
  console.log('Call offer sent');
  return roomId;
};

export const acceptCall = async (callerId, calleeId, roomId) => {
  const answer = {
    type: 'answer',
    callerId: callerId,
    calleeId: calleeId,
    createdAt: new Date().toISOString(),
  };

  await sendSignal(roomId, answer);
  console.log(`Call answered by ${calleeId}`);
};

export const sendICECandidate = async (roomId, candidate) => {
  const iceCandidate = {
    type: 'ice-candidate',
    candidate: candidate,
    createdAt: new Date().toISOString(),
  };

  await sendSignal(roomId, iceCandidate);
};

let peerConnection = null;
let localStream = null;

export const initializeConnection = async (roomId, isCaller) => {
  const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  peerConnection = new RTCPeerConnection(configuration);

  try {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
  } catch (error) {
    console.error('Error accessing media devices:', error);
  }

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      sendICECandidate(roomId, event.candidate);
    }
  };

  peerConnection.ontrack = (event) => {
    const remoteStream = event.streams[0];
    console.log('Remote stream received', remoteStream);
  };

  if (isCaller) {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    sendSignal(roomId, { type: 'offer', offer });
    console.log('Call offer created');
  }
};


export const handleOffer = async (roomId, offer) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  sendSignal(roomId, { type: 'answer', answer });
  console.log('Answer sent');
};

export const handleAnswer = async (answer) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

export const handleICECandidate = async (candidate) => {
  try {
    const iceCandidate = new RTCIceCandidate(candidate);
    await peerConnection.addIceCandidate(iceCandidate);
    console.log('ICE Candidate added');
  } catch (error) {
    console.error('Error adding ICE candidate:', error);
  }
};
