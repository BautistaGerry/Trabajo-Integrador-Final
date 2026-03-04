import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useChat } from '../contexts/ChatContext';
import './ProfileScreen.css';

function ProfileScreen() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const isEditing = searchParams.get('edit') === 'true';

    const { user, updateProfile, theme, toggleTheme } = useChat();

    const [formData, setFormData] = useState({
        name: user.name,
        status: user.status
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(formData);
        setSearchParams({});
    };

    return (
        <div className="profile-screen-container">
            <div className="profile-header">
                <button
                    className="back-button"

                    onClick={() => navigate('/chats')}
                    title="Volver al chat"
                >
                    <i className="bi bi-arrow-left"></i>
                </button>
                <h2>Perfil</h2>
            </div>

            <div className="profile-content">
                <div className="profile-avatar">
                    <img src={user.avatar} alt="Mi perfil" />
                </div>

                {!isEditing ? (
                    <div className="profile-info-display">
                        <div className="info-item">
                            <label>Tu nombre</label>
                            <p>{user.name}</p>
                        </div>
                        <div className="info-item">
                            <label>Mensaje de estado</label>
                            <p className="status-text">{user.status}</p>
                        </div>
                        <div className="info-item">
                            <label>Tema de la aplicación</label>
                            <button className="theme-toggle-btn" onClick={toggleTheme}>
                                {theme === 'light' ? 'Pasar a Modo Oscuro' : 'Pasar a Modo Claro'}
                            </button>
                        </div>
                        <button
                            className="edit-button-main"
                            onClick={() => setSearchParams({ edit: 'true' })}
                        >
                            Editar Perfil
                        </button>
                    </div>
                ) : (
                    <form className="profile-edit-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name-input">Nombre completo</label>
                            <input
                                id="name-input"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status-input">Mensaje de estado</label>
                            <textarea
                                id="status-input"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                rows="3"
                                required
                            />
                        </div>
                        <div className="form-buttons">
                            <button type="submit" className="save-btn">Guardar Cambios</button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setSearchParams({})}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className="profile-footer">
                <p>Este es el perfil privado del usuario. Solo tú puedes ver y editar esta información.</p>
            </div>
        </div>
    );
}

export default ProfileScreen;
