import React, { useState } from 'react';
import axios from 'axios';
import './ChatWithGPT.css';

function ChatWithGPT() {
    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const COHERE_API_KEY = 'hY4wj2lUB0MnM9R7IOocJAwX9vU9gqMAlGFwia59';

    const handleChat = async () => {
        if (!userMessage.trim()) {
            setError('Please enter a message before submitting.');
            return;
        }

        setLoading(true);
        setError('');
        setMessages(prevMessages => [...prevMessages, { sender: 'user', text: userMessage }]);
        setUserMessage('');  // Clear input field

        try {
            const res = await axios.post(
                'https://api.cohere.ai/generate',
                {
                    prompt: userMessage,
                    max_tokens: 150,
                    temperature: 0.7,
                    top_p: 1,
                    stop_sequences: ["\n"],
                },
                {
                    headers: {
                        Authorization: `Bearer ${COHERE_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log(res.data);

            if (res.data && res.data.text) {
                const generatedText = res.data.text.trim() || 'No valid response from the model.';
                setMessages(prevMessages => [...prevMessages, { sender: 'cohere', text: generatedText }]);
                setModalContent(generatedText);
                setShowModal(true);
            } else {
                setError('No valid response from the model.');
            }
        } catch (error) {
            setError(
                'Error: ' +
                (error.response?.data?.error?.message || error.message || 'Unknown error.')
            );
            console.error('API error details:', error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="chatgpt-chat-container">
            <h1 style={{ color: '#6c63ff', fontSize: '24px', marginBottom: '15px' }}>
                Chat with Cohere
            </h1>
            <div className="chatgpt-chat-box">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`chatgpt-chat-bubble ${message.sender === 'user' ? 'user' : 'cohere'}`}
                    >
                        {message.text}
                    </div>
                ))}
                {loading && (
                    <div className="chatgpt-chat-bubble cohere">
                        Thinking...
                    </div>
                )}
            </div>
            <input
                className="chatgpt-chat-input"
                type="text"
                placeholder="Type your message..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                disabled={loading}
            />
            <button className="chatgpt-chat-button" onClick={handleChat} disabled={loading}>
                {loading ? 'Thinking...' : 'Ask'}
            </button>
        </div>
    );
}

export default ChatWithGPT;
