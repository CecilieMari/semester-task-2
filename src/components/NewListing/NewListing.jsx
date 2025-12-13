import React, { useState } from "react";
import styles from "./NewListing.module.css";
import { getCurrentUser } from "../api/Api";
import { useNavigate } from "react-router-dom";

function NewListing() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [mediaUrls, setMediaUrls] = useState(['']);
    const [endsAt, setEndsAt] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const user = getCurrentUser();

    const handleAddMediaUrl = () => {
        setMediaUrls([...mediaUrls, '']);
    };

    const handleMediaUrlChange = (index, value) => {
        const newUrls = [...mediaUrls];
        newUrls[index] = value;
        setMediaUrls(newUrls);
    };

    const handleRemoveMediaUrl = (index) => {
        const newUrls = mediaUrls.filter((_, i) => i !== index);
        setMediaUrls(newUrls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            const apiKey = localStorage.getItem('apiKey');

            const media = mediaUrls
                .filter(url => url.trim() !== '')
                .map(url => ({ url, alt: title }));

            const listingData = {
                title,
                description,
                media,
                endsAt: new Date(endsAt).toISOString(),
            };

            const response = await fetch('https://v2.api.noroff.dev/auction/listings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-Noroff-API-Key': apiKey,
                },
                body: JSON.stringify(listingData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors?.[0]?.message || 'Failed to create listing');
            }

            const data = await response.json();
            navigate('/profil'); // Redirect to profile page
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className={styles.newListingContainer}>
            <div className={styles.formCard}>
                <h1>Upload your item </h1>
                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Enter listing title"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows="5"
                            placeholder="Describe your item..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Media URLs</label>
                        {mediaUrls.map((url, index) => (
                            <div key={index} className={styles.mediaUrlGroup}>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => handleMediaUrlChange(index, e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                />
                                {mediaUrls.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveMediaUrl(index)}
                                        className={styles.removeButton}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddMediaUrl}
                            className={styles.addButton}
                        >
                            + Add Another Image
                        </button>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="endsAt">Auction End Date *</label>
                        <input
                            type="datetime-local"
                            id="endsAt"
                            value={endsAt}
                            onChange={(e) => setEndsAt(e.target.value)}
                            required
                            min={new Date().toISOString().slice(0, 16)}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Listing'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NewListing;