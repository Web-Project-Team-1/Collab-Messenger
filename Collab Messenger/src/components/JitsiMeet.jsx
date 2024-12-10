import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const JitsiMeet = () => {
    const { roomId } = useParams();
    const jitsiContainerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (window.JitsiMeetExternalAPI) {
            const domain = 'meet.jit.si';
            const options = {
                roomName: roomId,
                width: '100%',
                height: '100%',
                parentNode: jitsiContainerRef.current,
                configOverwrite: {
                    startWithAudioMuted: true,
                    startWithVideoMuted: false,
                },
                interfaceConfigOverwrite: {
                    filmStripOnly: false,
                },
            };

            const api = new window.JitsiMeetExternalAPI(domain, options);

            return () => {
                api.dispose();
            };
        } else {
            console.error("JitsiMeetExternalAPI is not loaded.");
        }
    }, [roomId]);

    return <div ref={jitsiContainerRef} style={{ height: '100vh' }}></div>;
};

export default JitsiMeet;
