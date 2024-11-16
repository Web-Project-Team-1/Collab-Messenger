import { useState, useEffect, useContext } from 'react';
import { ref, push, onValue, off } from 'firebase/database';
import { db } from '../../config/firebase.config';
import { AppContext } from '../../store/app.context';

export default function Chat({ teamId }) {
    const { user } = useContext(AppContext);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const messagesRef = ref(db, `teams/${teamId}/chat`);
        const listener = (snapshot) => {
            const data = snapshot.val();
            const loadedMessages = data ? Object.values(data) : [];
            setMessages(loadedMessages);
        };
        onValue(messagesRef, listener);
        return () => {
            off(messagesRef, 'value', listener);
        };
    }, [teamId]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const messageData = {
            text: message,
            senderId: user.uid,
            username: user.email,
            timestamp: Date.now(),
        };

        const messagesRef = ref(db, `teams/${teamId}/chat`);
        await push(messagesRef, messageData);
        setMessage('');
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className="chat-message">
                        <strong>{msg.username}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}
