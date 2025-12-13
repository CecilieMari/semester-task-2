const API_BASE_URL = 'https://v2.api.noroff.dev';
const API_AUCTION = `${API_BASE_URL}/auction`;

export async function fetchListingById(id) {
  try {
    const response = await fetch(`${API_AUCTION}/listings/${id}?_seller=true&_bids=true`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching listing ${id}:`, error);
    throw error;
  }
}

export async function createNewListing(listingData) {
  try {
    const token = localStorage.getItem('accessToken');
    const apiKey = localStorage.getItem('apiKey');

    const response = await fetch(`${API_AUCTION}/listings`, {
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

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
}

export async function placeBid(listingId, amount) {
  try {
    const token = localStorage.getItem('accessToken');
    const apiKey = localStorage.getItem('apiKey');

    const response = await fetch(`${API_AUCTION}/listings/${listingId}/bids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Noroff-API-Key': apiKey,
      },
      body: JSON.stringify({ amount: Number(amount) }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || 'Failed to place bid');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error placing bid:', error);
    throw error;
  }
}