import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../services/users.service';
import { sendMessage } from '../../services/personal.chats.service';
import { AppContext } from '../../store/app.context';
import './StartMeeting.css';

const StartMeeting = () => {

    const { user } = useContext(AppContext);

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

        useEffect(() => {
            const fetchUsers = async () => {
                const usersData = await getAllUsers();
                setUsers(usersData || []);
            };

            fetchUsers();
            setSelectedUser(user);
        }, []);


    const handleStartMeeting = async () => {
        if (selectedUser) {
            const roomId = `room-${Date.now()}`;
            const meetingLink = `${window.location.origin}/video-call/${roomId}`;
            console.log(user)

            try {
                await sendMessage({
                    senderId: user.uid,
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
            <h1>Start Call</h1>
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
                Start Call
            </button>
        </div>
    );
};

export default StartMeeting;
