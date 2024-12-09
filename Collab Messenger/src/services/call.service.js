import { API_KEY } from "../constants/constants";

export const createMeeting = async () => {
    try {
        const response = await fetch('https://api.dyte.io/v2/meetings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "title": "meeting-room-1",
                "preferred_region": "us-east-1",
                "record_on_start": false,
                "live_stream_on_start": false,
                "recording_config": {
                    "max_seconds": 3600,
                    "file_name_prefix": "meeting_recording",
                    "video_config": {
                        "codec": "H264",
                        "width": 1280,
                        "height": 720,
                        "watermark": {
                            "url": "http://example.com/logo.png",
                            "size": { "width": 50, "height": 50 },
                            "position": "left top"
                        },
                        "export_file": true
                    },
                    "audio_config": {
                        "codec": "AAC",
                        "channel": "stereo",
                        "export_file": true
                    }
                },
                "ai_config": {
                    "transcription": {
                        "keywords": ["meeting", "discussion"],
                        "language": "en-US",
                        "profanity_filter": false
                    },
                    "summarization": {
                        "word_limit": 500,
                        "text_format": "markdown",
                        "summary_type": "general"
                    }
                },
                "persist_chat": false,
                "summarize_on_end": true
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create meeting');
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating meeting:", error);
        throw error;
    }
};

export const addParticipant = async (meetingId, participantData) => {
    try {
        const response = await fetch('https://api.dyte.io/v2/meetings/participant', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                meetingId: meetingId,  
                participant: participantData,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to add participant');
        }

        return await response.json();
    } catch (error) {
        console.error("Error adding participant:", error);
        throw error;
    }
};
