import React, { useEffect, useRef, useState } from 'react';
import { createRoom, joinRoom, sendSignal, listenForSignals } from '../../services/webrtc';

const AudioCall = ({ roomId, isCaller }) => {
    const [connected, setConnected] = useState(false);
    const localStream = useRef(null);
    const remoteStream = useRef(null);
    const peerConnection = useRef(null);

    useEffect(() => {
        const initCall = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStream.current.srcObject = stream;

            peerConnection.current = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            });

            peerConnection.current.onicecandidate = (event) => {
                if (event.candidate) {
                    sendSignal(roomId, { candidate: event.candidate });
                }
            };

            peerConnection.current.ontrack = (event) => {
                if (remoteStream.current) {
                    remoteStream.current.srcObject = event.streams[0];
                }
            };

            stream.getTracks().forEach((track) => {
                peerConnection.current.addTrack(track, stream);
            });

            listenForSignals(roomId, async (signal) => {
                if (signal.offer && !isCaller) {
                    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(signal.offer));
                    const answer = await peerConnection.current.createAnswer();
                    await peerConnection.current.setLocalDescription(answer);
                    sendSignal(roomId, { answer });
                }

                if (signal.answer && isCaller) {
                    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(signal.answer));
                    setConnected(true);
                }

                if (signal.candidate) {
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(signal.candidate));
                }
            });

            if (isCaller) {
                const offer = await peerConnection.current.createOffer();
                await peerConnection.current.setLocalDescription(offer);
                sendSignal(roomId, { offer });
            }
        };

        initCall();

        return () => {
            peerConnection.current?.close();
        };
    }, [roomId, isCaller]);

    return (
        <div>
            <h3>Audio Call</h3>
            <audio ref={localStream} autoPlay muted />
            <audio ref={remoteStream} autoPlay />
            {connected ? <p>Call Connected</p> : <p>Connecting...</p>}
        </div>
    );
};

export default AudioCall;
