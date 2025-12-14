import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchListingById, placeBid } from '../api/Api.listing.jsx';
import { getCurrentUser } from '../api/Api';
import styles from './singellisting.module.css';

function SingelListing() {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [bidAmount, setBidAmount] = useState('');
    const [bidError, setBidError] = useState(null);
    const [bidSuccess, setBidSuccess] = useState(false);
    const [sellerListings, setSellerListings] = useState([]);
    const user = getCurrentUser();

    useEffect(() => {
        async function loadListing() {
            try {
                const data = await fetchListingById(id);
                setListing(data);
                
                // Fetch more listings from the same seller
                if (data.seller?.name) {
                    const token = localStorage.getItem('accessToken');
                    const apiKey = localStorage.getItem('apiKey');
                    
                    const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${data.seller.name}/listings?_bids=true`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'X-Noroff-API-Key': apiKey,
                        }
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        // Filter out current listing and show max 3 other listings
                        const otherListings = (result.data || []).filter(item => item.id !== id).slice(0, 3);
                        setSellerListings(otherListings);
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadListing();
    }, [id]);

    async function handlePlaceBid(e) {
        e.preventDefault();
        setBidError(null);
        setBidSuccess(false);

        if (!user) {
            setBidError('You must be logged in to place a bid');
            return;
        }

        if (!bidAmount || bidAmount <= 0) {
            setBidError('Please enter a valid bid amount');
            return;
        }

        try {
            await placeBid(id, bidAmount);
            setBidSuccess(true);
            setBidAmount('');
            // Reload listing to show updated bids
            const updatedData = await fetchListingById(id);
            setListing(updatedData);
        } catch (err) {
            setBidError(err.message);
        }
    }

    if (loading) return <div className={styles.listingContainer}>Loading...</div>;
    if (error) return <div className={styles.listingContainer}>Error: {error}</div>;
    if (!listing) return <div className={styles.listingContainer}>No listing found.</div>;

    return (
        <div className={styles.listingContainer}>
            <div className={styles.listingCard}>
                <div className={styles.listingHeader}>
                    {/* Left side - Images */}
                    <div className={styles.mediaContainer}>
                        {listing.media && listing.media.length > 0 ? (
                            <>
                                <img 
                                    src={listing.media[selectedImage]?.url || 'https://via.placeholder.com/400'} 
                                    alt={listing.title}
                                    className={styles.mainImage}
                                />
                                {listing.media.length > 1 && (
                                    <div className={styles.thumbnailContainer}>
                                        {listing.media.map((mediaItem, index) => (
                                            <img
                                                key={index}
                                                src={mediaItem.url}
                                                alt={`${listing.title} ${index + 1}`}
                                                className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
                                                onClick={() => setSelectedImage(index)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <img 
                                src="https://via.placeholder.com/400" 
                                alt="No image"
                                className={styles.mainImage}
                            />
                        )}
                    </div>

                    {/* Right side - Info */}
                    <div className={styles.listingInfo}>
                        <h1 className={styles.listingTitle}>{listing.title}</h1>
                          <div className={styles.detailItem}>
                                <strong>Highest bid:</strong> {listing.bids && listing.bids.length > 0 
                                    ? `${Math.max(...listing.bids.map(bid => bid.amount))} NOK`
                                    : 'No bids yet'}
                            </div>
                        
                        <div className={styles.listingDescription}>
                            <p>{listing.description || 'No description available.'}</p>
                        </div>
                         <div className={`${styles.detailItem} ${styles.sellerInfo}`}>
                                <strong>Seller:</strong> {listing.seller?.name || 'Unknown'}
                            </div>
                            
                        <div className={styles.smallDetails}>
                            <span>Auction ends: {new Date(listing.endsAt).toLocaleString()}</span>
                            <span>Current bids: {listing._count?.bids || 0}</span>
                        </div>

                          {user ? (
                            <div className={styles.bidSection}>
                                <h3>Place Your Bid</h3>
                                <form onSubmit={handlePlaceBid} className={styles.bidForm}>
                                    <input
                                        type="number"
                                        placeholder="Enter bid amount (NOK)"
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        className={styles.bidInput}
                                        min="1"
                                    />
                                    <button type="submit" className={styles.bidButton}>
                                        Place Bid
                                    </button>
                                </form>
                                {bidError && <p className={styles.bidError}>{bidError}</p>}
                                {bidSuccess && <p className={styles.bidSuccess}>Bid placed successfully!</p>}
                            </div>
                        ) : (
                            <div className={styles.bidSection}>
                                <p className={styles.loginMessage}>Please log in to place a bid</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* More from this seller */}
                {sellerListings.length > 0 && (
                    <div className={styles.moreFromSeller}>
                        <h2 className={styles.moreFromSellerTitle}>More from {listing.seller?.name}</h2>
                        <div className={styles.sellerListingsGrid}>
                            {sellerListings.map((item) => (
                                <a key={item.id} href={`/auction/${item.id}`} className={styles.sellerListingCard}>
                                    {item.media?.[0]?.url ? (
                                        <img src={item.media[0].url} alt={item.title} className={styles.sellerListingImage} />
                                    ) : (
                                        <div className={styles.sellerListingNoImage}>No image</div>
                                    )}
                                    <div className={styles.sellerListingContent}>
                                        <h3 className={styles.sellerListingTitle}>{item.title}</h3>
                                        <p className={styles.sellerListingBids}>
                                            {item.bids && item.bids.length > 0 
                                                ? `Highest bid: ${Math.max(...item.bids.map(bid => bid.amount))} NOK`
                                                : 'No bids yet'}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SingelListing;
