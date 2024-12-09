import React, { useState, useEffect } from "react";
import { db, collection, getDocs } from "../../config/firebase.config";  
import { DyteMeeting } from "@dytesdk/react-web-core";
import { createMeeting, addParticipant } from "../../services/call.service";

const AudioCall = () => {
    const [meeting, setMeeting] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const usersList = querySnapshot.docs.map(doc => doc.data());
                setUsers(usersList);
            } catch (error) {
                console.error("Error fetching users from Firebase:", error);
                setError("Error fetching users.");
            }
        };

        fetchUsers();
    }, []);

    const initializeMeeting = async () => {
        setLoading(true);
        setError(null);

        try {
            const meetingData = await createMeeting();
            setMeeting(meetingData);

            for (let user of users) {
                const participantData = {
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,                         
                    uid: user.uid                             
                };

                try {
                    await addParticipant(meetingData.id, participantData);
                } catch (error) {
                    console.error(`Error adding participant ${user.firstName}:`, error);
                    setError("Error adding some participants.");
                }
            }

        } catch (error) {
            console.error("Error initializing meeting:", error);
            setError("Error creating the meeting.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : !meeting ? (
                <button onClick={initializeMeeting} disabled={loading}>
                    {loading ? "Joining..." : "Join Meeting"}
                </button>
            ) : (
                <DyteMeeting meeting={meeting} />
            )}
        </div>
    );
};

export default AudioCall;
