
import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useNavigate, useParams } from 'react-router-dom';
import { MdChat, MdMoreVert, MdSearch, MdDarkMode, MdLightMode } from 'react-icons/md';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    const { user, filteredContacts, searchQuery, setSearchQuery, messages, theme, toggleTheme } = useChat();
    const navigate = useNavigate();
    const { contactId } = useParams();

    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>

                <img
                    src={user.avatar}
                    alt="Me"
                    className={styles.avatar}
                    onClick={() => navigate('/profile')}
                    style={{ cursor: 'pointer' }}
                    title="Ver perfil"
                />
                <div className={styles.headerIcons}>
                    <div onClick={toggleTheme} className={styles.iconBtn} title="Cambiar tema">
                        {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
                    </div>
                    <MdChat title="Nuevo chat" />
                    <MdMoreVert title="Menú" />
                </div>
            </div>

            <div className={styles.searchContainer}>
                <div className={styles.searchBar}>
                    <MdSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Busca un chat o inicia uno nuevo"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>



            <div className={styles.contactList}>
                {filteredContacts.map((contact) => {
                    const chatMessages = messages[contact.id] || [];
                    const lastMsg = chatMessages[chatMessages.length - 1];

                    return (
                        <div
                            key={contact.id}
                            className={`${styles.contactItem} ${contactId === contact.id ? styles.active : ''}`}
                            onClick={() => navigate(`/chats/${contact.id}`)}
                        >
                            <img src={contact.avatar} alt={contact.name} className={styles.contactAvatar} />
                            <div className={styles.contactInfo}>
                                <div className={styles.contactMain}>
                                    <span className={styles.contactName}>{contact.name}</span>
                                    <span className={styles.contactTime}>
                                        {lastMsg ? lastMsg.timestamp : contact.timestamp}
                                    </span>
                                </div>
                                <div className={styles.contactLastMsg}>
                                    {lastMsg ? lastMsg.text : contact.lastMessage}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;
