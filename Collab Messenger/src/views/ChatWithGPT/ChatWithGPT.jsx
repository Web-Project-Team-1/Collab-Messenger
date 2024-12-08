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

    const HF_API_KEY = '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';

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
                'https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B',
                { inputs: userMessage },
                {
                    headers: {
                        Authorization: `Bearer ${HF_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const cleanedResponse = cleanResponse(res.data[0]?.generated_text) || 'No valid response from the model.';
            setResponse(cleanedResponse);
            setModalContent(cleanedResponse);
            setShowModal(true);
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

    const cleanResponse = (response) => {
        const maxLength = 200;

        let cleaned = response.replace(/(\d+\s?[\+\-\*\/\(\)]+)|(\d{3,})/g, '').trim();
        cleaned = cleaned.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ');
        cleaned = cleaned.length > maxLength ? cleaned.substring(0, maxLength) + '...' : cleaned;

        return cleaned;
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="chatgpt-container">
            <input
                className="chatgpt-input"
                type="text"
                placeholder="Ask something..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                disabled={loading}
            />
            <button className="chatgpt-button" onClick={handleChat} disabled={loading}>
                {loading ? 'Loading...' : 'Ask GPT'}
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
