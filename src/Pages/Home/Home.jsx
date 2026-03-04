
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../contexts/ChatContext';

import styles from './Home.module.css';


const Home = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useChat();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() && password.trim()) {
            login(name);
            navigate('/chats');
        }
    };

    return (

        <div className={styles.loginPage}>
            <div className={styles.yellowBar}>
            </div>

            <div className={styles.loginContent}>
                <div className={styles.simpleCard}>
                    <img
                        src="https://img.icons8.com/color/144/homer-simpson.png"
                        alt="Homer Simpson"
                        className={styles.simpsonLogo}
                    />
                    <h1 className={styles.simpsonTitle}>WhatsApp Simpsons</h1>
                    <p className={styles.simpsonSubtitle}>¡Ay Caramba! Introduce tu nombre para empezar</p>

                    <form className={styles.simpleForm} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                placeholder="Tu nombre"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoFocus
                            />
                            <input
                                type="password"
                                placeholder="Tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.simpsonButton}>D'OH! (ENTRAR)</button>
                    </form>
                </div>
            </div>

            <div className={styles.simpleFooter}>
                <p>Springfield Edition</p>
            </div>
        </div>
    );
};


export default Home;
