
import React from 'react';
import { useParams, Outlet } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar/Sidebar';
import ChatWindow from '../../Components/Chat/ChatWindow';
import styles from './ChatView.module.css';

const ChatView = () => {
    const { contactId } = useParams();

    return (
        <div className={`${styles.appContainer} ${contactId ? styles.chatActive : ''}`}>
            <div className={styles.sidebarWrapper}>
                <Sidebar />
            </div>
            <div className={styles.chatWrapper}>
                {contactId ? <ChatWindow /> : <div className={styles.welcome}>Selecciona un chat para comenzar</div>}
            </div>
        </div>
    );
};

export default ChatView;
