import React, { useState } from 'react';
import axios from 'axios';
import './ChatWithGPT.css';

function ChatWithGPT() {
    const [userMessage, setUserMessage] = useState('');
    const [response, setResponse] = useState('');
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
        setResponse('');

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
                setResponse(generatedText);
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
            <input
                className="chatgpt-chat-input"
                type="text"
                placeholder="Ask something..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                disabled={loading}
            />
            <button className="chatgpt-chat-button" onClick={handleChat} disabled={loading}>
                {loading ? 'Loading...' : 'Ask Cohere'}
            </button>

            {error && <p className="chatgpt-error-text">{error}</p>}

            {/* Modal View for Response */}
            {showModal && (
                <div className="chatgpt-modal-overlay">
                    <div className="chatgpt-modal-content">
                        <h2 className="chatgpt-modal-heading">Response</h2>
                        <p className="chatgpt-modal-text">{modalContent}</p>
                        <button onClick={closeModal} className="chatgpt-modal-close-button">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatWithGPT;
