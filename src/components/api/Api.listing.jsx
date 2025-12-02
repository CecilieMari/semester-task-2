import { useEffect, useState } from 'react';
import { fetchAuctionListings } from '../api/auctionApi';

function AuctionList() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadListings() {
      try {
        const data = await fetchAuctionListings();
        setListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadListings();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {listings.map(listing => (
        <div key={listing.id}>{listing.title}</div>
      ))}
    </div>
  );
}

export default AuctionList;