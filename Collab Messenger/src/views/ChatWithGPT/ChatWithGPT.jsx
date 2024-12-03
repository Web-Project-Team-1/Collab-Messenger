import React, { useState } from 'react';
import axios from 'axios';
import { API_KEY } from '../../constants/constants';

function ChatWithGPT() {
    const [userMessage, setUserMessage] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: userMessage }]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setResponse(res.data.choices[0]?.message?.content || 'No response from GPT.');
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
    

    return (
        <div>
            <input
                type="text"
                placeholder="Ask ChatGPT something..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                disabled={loading} 
            />
            <button onClick={handleChat} disabled={loading}>
                {loading ? 'Loading...' : 'Ask ChatGPT'}
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {response && <p>ChatGPT says: {response}</p>}
        </div>
    );
}

export default ChatWithGPT;
