import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchListings } from '../api/Api';
import styles from './Searc.module.css';

function Searc() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');

        try {
            const data = await searchListings(query);
            setResults(data);
        } catch (err) {
            setError('Failed to search listings');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.searchContainer}>
            <form className={styles.searchForm} onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for listings..."
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <p className={styles.error}>{error}</p>}

            {results.length > 0 && (
                <div className={styles.resultsContainer}>
                    <h2>Search Results ({results.length})</h2>
                    <div className={styles.resultsGrid}>
                        {results.map((listing) => (
                            <div 
                                key={listing.id} 
                                className={styles.resultCard}
                                onClick={() => navigate(`/auction/${listing.id}`)}
                            >
                                {listing.media?.[0]?.url ? (
                                    <img src={listing.media[0].url} alt={listing.title} className={styles.resultImage} />
                                ) : (
                                    <div className={styles.noImage}>No image</div>
                                )}
                                <div className={styles.resultContent}>
                                    <h3>{listing.title}</h3>
                                    <p>{listing._count?.bids || 0} bids</p>
                                    <p className={styles.highestBid}>
                                        {listing.bids && listing.bids.length > 0 
                                            ? `Highest bid: ${Math.max(...listing.bids.map(bid => bid.amount))} NOK`
                                            : 'No bids yet'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && results.length === 0 && query && (
                <p className={styles.noResults}>No results found for "{query}"</p>
            )}
        </div>
    );
}

export default Searc;
