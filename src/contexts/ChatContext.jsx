
import React, { createContext, useState, useContext, useEffect } from 'react';
import { CONTACTS, INITIAL_MESSAGES } from '../mocks/data';
import { v4 as uuidv4 } from 'uuid';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('chat-user');
        const defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsNUgzV6OrJr5aSQTZIdIFYjbr7bYdceLHaQ&s';

        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            if (!parsed.avatar) {
                parsed.avatar = defaultAvatar;
                localStorage.setItem('chat-user', JSON.stringify(parsed));
            }
            return parsed;
        }

        return {
            name: 'Usuario',
            avatar: defaultAvatar,
            status: '¡Hola! Estoy usando WhatsApp Simpson.'
        };
    });

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('chat-theme') || 'light';
    });


    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('chat-messages');
        const parsedMessages = savedMessages ? JSON.parse(savedMessages) : {};

        const allContactIds = new Set([
            ...Object.keys(INITIAL_MESSAGES),
            ...Object.keys(parsedMessages)
        ]);

        const mergedMessages = {};
        allContactIds.forEach(id => {
            const initial = INITIAL_MESSAGES[id] || [];
            const saved = parsedMessages[id] || [];

            const combined = [...initial, ...saved];
            mergedMessages[id] = combined.filter((msg, index, self) =>
                index === self.findIndex((m) => m.id === msg.id)
            );
        });

        return mergedMessages;
    });

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        localStorage.setItem('chat-user', JSON.stringify(user));
    }, [user]);

    useEffect(() => {
        localStorage.setItem('chat-messages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        localStorage.setItem('chat-theme', theme);
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [theme]);

    const sendMessage = (contactId, text) => {
        const id = uuidv4();
        const newMessage = {
            id,
            text,
            sender: 'me',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sentAt: Date.now(),
            read: false,
        };

        setMessages((prev) => ({
            ...prev,
            [contactId]: [...(prev[contactId] || []), newMessage],
        }));

        setTimeout(() => {
            setMessages((prev) => ({
                ...prev,
                [contactId]: (prev[contactId] || []).map((m) =>
                    m.id === id ? { ...m, read: true } : m
                ),
            }));
        }, 1500);
    };

    const login = (name) => {
        setUser((prev) => ({ ...prev, name }));
    };

    const updateProfile = (newData) => {
        setUser((prev) => ({ ...prev, ...newData }));
    };

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const timestampToScore = (ts) => {
        if (!ts) return 0;
        const timeMatch = ts.match(/^(\d{1,2}):(\d{2})$/);
        if (timeMatch) {
            return 10000 + parseInt(timeMatch[1]) * 60 + parseInt(timeMatch[2]);
        }
        const labels = {
            'hace un momento': 9999,
            'hoy': 9000,
            'ayer': 8000,
            'lunes': 7006,
            'martes': 7005,
            'miércoles': 7004,
            'miercoles': 7004,
            'jueves': 7003,
            'viernes': 7002,
            'sábado': 7001,
            'sabado': 7001,
            'domingo': 7000,
        };
        return labels[ts.toLowerCase()] ?? 1;
    };

    const filteredContacts = CONTACTS
        .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((c) => {
            const chatMsgs = messages[c.id] || [];
            const lastMsg = chatMsgs[chatMsgs.length - 1];
            const score = lastMsg?.sentAt
                ? lastMsg.sentAt
                : timestampToScore(lastMsg ? lastMsg.timestamp : c.timestamp);
            return { ...c, _score: score };
        })
        .sort((a, b) => b._score - a._score);


    return (
        <ChatContext.Provider
            value={{
                user,
                messages,
                sendMessage,
                login,
                updateProfile,
                theme,
                toggleTheme,
                searchQuery,
                setSearchQuery,
                filteredContacts,
                contacts: CONTACTS,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
export const useUser = () => useContext(ChatContext);
