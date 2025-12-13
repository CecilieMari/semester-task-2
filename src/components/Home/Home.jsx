import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./home.module.css";
import { fetchAuctionListings, getCurrentUser } from "../api/Api";

function Home() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = getCurrentUser();

    useEffect(() => {
        async function loadListings() {
            try {
                const data = await fetchAuctionListings();
                console.log('API Response:', data);
                console.log('Listings:', data.data || data);
                setListings(data.data || data);
            } catch (err) {
                console.error('Error loading listings:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        
        loadListings();
    }, []);

    console.log('Current listings state:', listings);

    return (
        <>
            <div className={styles.heroSection}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className={styles.textCol + " col-md-6 order-md-1 order-2"}>
                            <h1 className="mb-4">Start your auction now</h1>
                            <p className="lead mb-4">Discover, sell, and win — simply and safely.</p>
                            <Link 
                                to={user ? "/profil" : "/register"} 
                                className={styles.buttonCol + " btn btn-lg"}
                            >
                                {user ? "Go to My Profile" : "Create Account"}
                            </Link>
                        </div>
                        <div className={styles.imageCol + " col-md-6 text-center order-md-2 order-1 mb-4 mb-md-0"}>
                            <img 
                                src="../image/index-image.gif" 
                                alt="Auction" 
                                className="img-fluid rounded"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.featuresSection}>
                <div className="container">
                    <div className="row text-center">
                        <div className="col-md-4 mb-4">
                            <div className={styles.iconBox}>
                                <img 
                                    src="../image/user (1).png" 
                                    alt="Create profile" 
                                    className={styles.icon}
                                />
                                <h5 className="mt-3">Create a profile</h5>
                                <p>Sign up and start your auction journey today</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className={styles.iconBox}>
                                <img 
                                    src="../image/cloud-computing.png" 
                                    alt="Upload item" 
                                    className={styles.icon}
                                />
                                <h5 className="mt-3">Upload your item</h5>
                                <p>List your items and reach thousands of bidders</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className={styles.iconBox}>
                                <img 
                                    src="../image/auction (1).png" 
                                    alt="Buy or sell" 
                                    className={styles.icon}
                                />
                                <h5 className="mt-3">Buy or sell</h5>
                                <p>Bid on items or sell to the highest bidder</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Auction Listings Section */}
            <div className="container my-5">
                <h2 className="text-center mb-4" style={{ fontWeight: 200 }}>Latest Updates</h2>
                
                {loading && <div className="text-center">Loading auctions...</div>}
                {error && <div className="alert alert-danger">Error: {error}</div>}
                
                <div className={styles.mobileScrollContainer}>
                    <div className="row">
                        {listings.slice(0, 6).map((listing) => (
                            <div key={listing.id} className="col-md-4 mb-4">
                                <div className="card h-100 border-0">
                                    <img 
                                        src={listing.media?.[0]?.url || 'https://via.placeholder.com/300'} 
                                        className="card-img-top" 
                                        alt={listing.title}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{listing.title}</h5>
                                        <p className="card-text">{listing.description?.substring(0, 100)}...</p>
                                        <p className="text-muted">Bids: {listing._count?.bids || 0}</p>
                                        <Link to={`/auction/${listing.id}`} className={styles.bidButton}>
                                            Bid on me
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;