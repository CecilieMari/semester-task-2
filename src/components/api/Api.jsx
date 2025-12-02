const API_BASE_URL = 'https://v2.api.noroff.dev/auction/listings';

export async function fetchAuctionListings() {
  try {
    const response = await fetch(API_BASE_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching auction listings:', error);
    throw error;
  }
}

export async function fetchAuctionById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching auction ${id}:`, error);
    throw error;
  }
}