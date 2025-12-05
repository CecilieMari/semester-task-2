// Profil component for displaying user profile information and settings

import React, { useState, useEffect } from 'react';
import styles from './Profil.module.css';
import { getCurrentUser } from '../api/Api';

function Profil() {
    const [user, setUser] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [bio, setBio] = useState('');
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const userData = getCurrentUser();
        if (userData) {
            setUser(userData);
            setAvatarUrl(userData.avatar?.url || '');
            setBio(userData.bio || '');
        }
    }, []);

    const handleUpdateAvatar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('accessToken');
            const apiKey = localStorage.getItem('apiKey');
            
            const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${user.name}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-Noroff-API-Key': apiKey,
                },
                body: JSON.stringify({
                    avatar: {
                        url: avatarUrl,
                        alt: `${user.name}'s avatar`
                    }
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors?.[0]?.message || 'Failed to update avatar');
            }

            const data = await response.json();
            const updatedUser = { ...user, avatar: data.data.avatar };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            setSuccess('Profile picture updated!');
            setIsEditingAvatar(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBio = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('accessToken');
            const apiKey = localStorage.getItem('apiKey');
            
            const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${user.name}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-Noroff-API-Key': apiKey,
                },
                body: JSON.stringify({
                    bio: bio
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors?.[0]?.message || 'Failed to update bio');
            }

            const data = await response.json();
            const updatedUser = { ...user, bio: data.data.bio };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            setSuccess('Bio updated!');
            setIsEditingBio(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className={styles.profilContainer}>Loading...</div>;
    }

    return (
        <div className={styles.profilContainer}>
            <div className={styles.profileCard}>
                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}

                <div className={styles.profileHeader}>
                    {/* Left side - Avatar */}
                    <div className={styles.avatarSection}>
                        <img 
                            src={user.avatar?.url || 'https://via.placeholder.com/200x300'} 
                            alt="Profile" 
                            className={styles.profileImage} 
                        />
                        {!isEditingAvatar ? (
                            <button 
                                onClick={() => setIsEditingAvatar(true)} 
                                className={styles.editButton}
                            >
                                Change Picture
                            </button>
                        ) : (
                            <form onSubmit={handleUpdateAvatar} className={styles.editForm}>
                                <input 
                                    type="url" 
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    placeholder="Image URL"
                                    required
                                    className={styles.input}
                                />
                                <div className={styles.buttonGroup}>
                                    <button type="submit" className={styles.saveButton} disabled={loading}>
                                        {loading ? 'Saving...' : 'Save'}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setIsEditingAvatar(false);
                                            setAvatarUrl(user.avatar?.url || '');
                                        }}
                                        className={styles.cancelButton}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Right side - Name and Bio */}
                    <div className={styles.infoSection}>
                        <h1 className={styles.userName}>Hi, I`m {user.name}</h1>
                        
                        <div className={styles.bioSection}>
                            <h3>About Me</h3>
                            {!isEditingBio ? (
                                <>
                                    <p className={styles.bioText}>
                                        {user.bio || 'No bio yet. Click edit to add one!'}
                                    </p>
                                    <button 
                                        onClick={() => setIsEditingBio(true)} 
                                        className={styles.editBioButton}
                                    >
                                        Edit Bio
                                    </button>
                                </>
                            ) : (
                                <form onSubmit={handleUpdateBio} className={styles.bioForm}>
                                    <textarea 
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Write something about yourself..."
                                        maxLength="160"
                                        rows="4"
                                        className={styles.bioTextarea}
                                    />
                                    <small>{bio.length}/160 characters</small>
                                    <div className={styles.buttonGroup}>
                                        <button type="submit" className={styles.saveButton} disabled={loading}>
                                            {loading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                setIsEditingBio(false);
                                                setBio(user.bio || '');
                                            }}
                                            className={styles.cancelButton}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        <div className={styles.stats}>
                            <div className={styles.statItem}>
                                <strong>Email:</strong> {user.email}
                            </div>
                            <div className={styles.statItem}>
                                <strong>Credits:</strong> {user.credits || 0}
                            </div>
                            <div className={styles.statItem}>
                                <strong>Wins:</strong> {user._count?.wins || 0}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profil;
