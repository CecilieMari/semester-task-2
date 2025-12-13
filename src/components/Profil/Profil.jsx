import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Profil.module.css';
import { getCurrentUser, fetchUserProfile } from '../api/Api';

function Profil() {
    const [user, setUser] = useState(null);               
    const [avatarUrl, setAvatarUrl] = useState('');
    const [bio, setBio] = useState('');
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [myListings, setMyListings] = useState([]);
    const [loadingListings, setLoadingListings] = useState(true);

    useEffect(() => {
        const userData = getCurrentUser();
        if (userData) {
            setUser(userData);
            setAvatarUrl(userData.avatar?.url || '');
            setBio(userData.bio || '');
            // Fetch fresh profile data with credits
            fetchUserProfile(userData.name).then(freshData => {
                setUser(freshData);
            }).catch(err => console.error('Error fetching fresh profile:', err));
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchMyListings(user.name);
        }
    }, [user]); // Re-fetch when user changes or component mounts

    const fetchMyListings = async (username) => {
        try {
            const token = localStorage.getItem('accessToken');
            const apiKey = localStorage.getItem('apiKey');
            
            const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${username}/listings`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Noroff-API-Key': apiKey,
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch listings');
            }
            
            const data = await response.json();
            setMyListings(data.data || []);
        } catch (err) {
            console.error('Error fetching listings:', err);
        } finally {
            setLoadingListings(false);
        }
    };

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
                        
                        {isEditingAvatar && (
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
                        <h1 className={styles.userName}>Hi, I'm {user.name}</h1>
                        
                        <div className={styles.bioSection}>
                            {!isEditingBio ? (
                                <p className={styles.bioText}>
                                    {user.bio || 'No bio yet. Click edit to add one!'}
                                </p>
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
                        </div>

                        {/* Action links under stats */}
                        <div className={styles.actionLinks}>
                            <Link to="/new-listing" className={styles.actionLink}>
                                Add New Listing
                            </Link>
                            <span className={styles.separator}>|</span>
                            {!isEditingAvatar && (
                                <>
                                    <button 
                                        onClick={() => setIsEditingAvatar(true)} 
                                        className={styles.actionLink}
                                    >
                                        Change Picture
                                    </button>
                                    <span className={styles.separator}>|</span>
                                </>
                            )}
                            {!isEditingBio && (
                                <button 
                                    onClick={() => setIsEditingBio(true)} 
                                    className={styles.actionLink}
                                >
                                    Edit Bio
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* My Listings Section */}
                <div className={styles.listingsSection}>
                    <h2 className={styles.listingsTitle}>My Listings</h2>
                    
                    {loadingListings ? (
                        <p>Loading your listings...</p>
                    ) : myListings.length === 0 ? (
                        <p className={styles.noListings}>
                            You haven't created any listings yet. 
                            <Link to="/new-listing" className={styles.createLink}> Create your first listing!</Link>
                        </p>
                    ) : (
                        <div className={styles.listingsGrid}>
                            {myListings.map((listing) => (
                                <div key={listing.id} className={styles.listingCard}>
                                    <img 
                                        src={listing.media?.[0]?.url || 'https://via.placeholder.com/300x200'} 
                                        alt={listing.title}
                                        className={styles.listingImage}
                                    />
                                    <div className={styles.listingInfo}>
                                        <h3 className={styles.listingTitle}>{listing.title}</h3>
                                        <p className={styles.listingDescription}>
                                            {listing.description?.substring(0, 80)}...
                                        </p>
                                        <div className={styles.listingStats}>
                                            <span>Bids: {listing._count?.bids || 0}</span>
                                            <span>Ends: {new Date(listing.endsAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className={styles.listingActions}>
                                            <Link to={`/auction/${listing.id}`} className={styles.viewButton}>
                                                View Listing
                                            </Link>
                                            <span className={styles.separator}>|</span>
                                            <Link to={`/edit-listing/${listing.id}`} className={styles.editButton}>
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profil;
