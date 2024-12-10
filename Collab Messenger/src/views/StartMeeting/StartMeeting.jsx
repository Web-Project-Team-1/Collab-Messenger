import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../services/users.service';
import { sendMessage } from '../../services/personal.chats.service';
import './StartMeeting.css';


const StartMeeting = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    const currentUser =

        useEffect(() => {
            const fetchUsers = async () => {
                const usersData = await getAllUsers();
                setUsers(usersData || []);
            };

            fetchUsers();
        }, []);

    const handleStartMeeting = async () => {
        if (selectedUser) {
            const roomId = `room-${Date.now()}`;
            const meetingLink = `${window.location.origin}/video-call/${roomId}`;
            console.log(currentUser)

            try {
                await sendMessage({
                    senderId: currentUser.id,
                    receiverId: selectedUser.id,
                    message: `You are invited to a meeting. Click the link to join: ${meetingLink}`,
                });

                navigate(`/video-call/${roomId}`);
            } catch (error) {
                console.error('Failed to send meeting link:', error);
                alert('Failed to send meeting link to the user. Please try again.');
            }
        } else {
            alert('Please select a user to start the meeting.');
        }
    };

    return (
        <div className="start-meeting-container">
            <h1>Start a Meeting</h1>
            <div className="user-list">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className={`user-item ${selectedUser === user ? 'selected' : ''}`}
                        onClick={() => setSelectedUser(user)}
                    >
                        {user.username}
                    </div>
                ))}
            </div>
            <button className="start-meeting-btn" onClick={handleStartMeeting}>
                Start Meeting
            </button>
        </div>
    );
};

export default StartMeeting;
