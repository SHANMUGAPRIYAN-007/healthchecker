import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

const Chat = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io('/', {
            path: '/socket.io'
        });

        socketRef.current.on('chat message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => socketRef.current.disconnect();
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim()) {
            const msg = { text: input, sender: user.name, id: Date.now() };
            // Optimistic updatel? No, wait for broadcast for simplicity or do both
            socketRef.current.emit('chat message', msg);
            setInput('');
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <h1>Chat Room</h1>
            <div className="chat-window">
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '20%' }}>
                        No messages yet. Start the conversation!
                    </div>
                )}
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`chat-bubble ${msg.sender === user.name ? 'sent' : 'received'}`}
                    >
                        <span className="chat-sender-name">{msg.sender}</span>
                        {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="chat-form">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="chat-input"
                    placeholder="Type a message..."
                />
                <button type="submit" style={{ width: 'auto' }}>Send</button>
            </form>
        </div>
    );
};

export default Chat;
