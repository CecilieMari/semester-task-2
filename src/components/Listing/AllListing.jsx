import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAuctionListings } from '../api/Api';
import styles from './alllisting.module.css';

function AllListing() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadListings() {
            try {
                const data = await fetchAuctionListings();
                setListings(data.data || data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadListings();
    }, []);

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (listings.length === 0) return <div className={styles.noListings}>No listings found.</div>;

    return (
        <div className={styles.listingsContainer}>
            <div className={styles.listingsGrid}>
                {listings.map((listing) => (
                    <div key={listing.id} className={styles.listingCard}>
                        {listing.media?.[0]?.url ? (
                            <img
                                src={listing.media[0].url}
                                alt={listing.title}
                                className={styles.listingImage}
                            />
                        ) : (
                            <div className={styles.noImage}>No image</div>
                        )}
                        <div className={styles.listingContent}>
                            <h3 className={styles.listingTitle}>{listing.title}</h3>
                            <span className={styles.listingBids}>
                                Number of bids: {listing._count?.bids || 0}
                            </span>
                            <span className={styles.listingPrice}>
                                {listing.bids && listing.bids.length > 0 
                                    ? `Highest bid: ${Math.max(...listing.bids.map(bid => bid.amount))} NOK`
                                    : 'No bids yet'}
                            </span>
                            <Link to={`/auction/${listing.id}`} className={styles.viewButton}>
                                Bid on me
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllListing;