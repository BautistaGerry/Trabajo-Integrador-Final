
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../../contexts/ChatContext';
import { MdSend, MdAttachFile, MdMoreVert, MdArrowBack, MdDone, MdDoneAll } from 'react-icons/md';
import clsx from 'clsx';
import styles from './ChatWindow.module.css';

const getDateLabel = (timestamp) => {
    if (!timestamp) return null;
    if (isNaN(Date.parse(`2000-01-01 ${timestamp}`))) return timestamp;
    return null;
};

const buildMessagesWithSeparators = (msgs) => {
    const result = [];
    let lastLabel = null;

    msgs.forEach((msg, idx) => {
        const label = getDateLabel(msg.timestamp);
        if (label && label !== lastLabel) {
            result.push({ type: 'separator', label, key: `sep-${idx}` });
            lastLabel = label;
        }
        result.push({ type: 'message', msg });
    });

    return result;
};

const ChatWindow = () => {
    const { contactId } = useParams();
    const navigate = useNavigate();
    const { messages, sendMessage, contacts } = useChat();
    const [inputText, setInputText] = useState('');
    const scrollRef = useRef(null);

    const contact = contacts.find((c) => c.id === contactId);
    const chatMessages = messages[contactId] || [];
    const items = buildMessagesWithSeparators(chatMessages);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (inputText.trim()) {
            sendMessage(contactId, inputText);
            setInputText('');
        }
    };

    if (!contact) return null;

    return (
        <div className={styles.chatWindow}>
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <MdArrowBack
                        className={styles.backBtn}
                        onClick={() => navigate('/chats')}
                    />
                    <img src={contact.avatar} alt={contact.name} className={styles.avatar} />
                    <div className={styles.contactDetails}>
                        <span className={styles.name}>{contact.name}</span>
                        <span className={styles.status}>en línea</span>
                    </div>
                </div>
                <div className={styles.headerIcons}>
                    <MdMoreVert />
                </div>
            </div>

            <div className={styles.messagesArea}>
                {items.map((item) => {
                    if (item.type === 'separator') {
                        return (
                            <div key={item.key} className={styles.dateSeparator}>
                                <span className={styles.dateLabel}>{item.label}</span>
                            </div>
                        );
                    }

                    const { msg } = item;
                    const isMe = msg.sender === 'me';

                    return (
                        <div
                            key={msg.id}
                            className={clsx(styles.messageLine, {
                                [styles.myLine]: isMe,
                                [styles.otherLine]: !isMe,
                            })}
                        >
                            <div className={clsx(styles.messageBox, {
                                [styles.myBox]: isMe,
                                [styles.otherBox]: !isMe,
                            })}>
                                <p className={styles.msgText}>{msg.text}</p>
                                <span className={styles.msgMeta}>
                                    <span className={styles.msgTime}>{msg.timestamp}</span>
                                    {isMe && (
                                        <span className={clsx(styles.ticks, { [styles.ticksRead]: msg.read })}>
                                            {msg.read
                                                ? <MdDoneAll className={styles.tickIcon} />
                                                : <MdDone className={styles.tickIcon} />
                                            }
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            <form className={styles.inputArea} onSubmit={handleSend}>
                <MdAttachFile className={styles.icon} />
                <input
                    type="text"
                    placeholder="Escribe un mensaje aquí"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <button type="submit" className={styles.sendBtn} disabled={!inputText.trim()}>
                    <MdSend />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
