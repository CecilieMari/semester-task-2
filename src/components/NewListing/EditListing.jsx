import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./newlisting.module.css"; // Bruk samme CSS som NewListing
import { getCurrentUser } from "../api/Api";
import { fetchListingById } from "../api/Api.listing";

function EditListing() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [mediaUrls, setMediaUrls] = useState(['']);
    const [endsAt, setEndsAt] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const navigate = useNavigate();

    const user = getCurrentUser();

    useEffect(() => {
        async function loadListing() {
            try {
                const listing = await fetchListingById(id);
                
                setTitle(listing.title);
                setDescription(listing.description || '');
                setMediaUrls(listing.media?.map(m => m.url) || ['']);
                setEndsAt(new Date(listing.endsAt).toISOString().slice(0, 16));
            } catch (err) {
                setError('Failed to load listing');
            } finally {
                setLoadingData(false);
            }
        }
        loadListing();
    }, [id]);

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
            };

            const response = await fetch(`https://v2.api.noroff.dev/auction/listings/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-Noroff-API-Key': apiKey,
                },
                body: JSON.stringify(listingData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors?.[0]?.message || 'Failed to update listing');
            }

            navigate('/profil');
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

    if (loadingData) {
        return <div className={styles.newListingContainer}>Loading...</div>;
    }

    return (
        <div className={styles.newListingContainer}>
            <div className={styles.formCard}>
                <h1>Edit Your Listing</h1>
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
                        <label>Auction End Date</label>
                        <input
                            type="datetime-local"
                            value={endsAt}
                            disabled
                            className={styles.disabledInput}
                        />
                        <small style={{ color: '#999' }}>End date cannot be changed</small>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Listing'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditListing;