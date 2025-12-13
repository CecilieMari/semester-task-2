const API_BASE_URL = 'https://v2.api.noroff.dev';
const API_AUTH = `${API_BASE_URL}/auth`;
const API_AUCTION = `${API_BASE_URL}/auction`;

// Create API Key
export async function createApiKey(accessToken) {
  try {
    const response = await fetch(`${API_AUTH}/create-api-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: 'Auction House Key'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || 'Failed to create API key');
    }

    const data = await response.json();
    return data.data.key;
  } catch (error) {
    console.error('Error creating API key:', error);
    throw error;
  }
}

// Register new user
export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_AUTH}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || 'Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

// Login user
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_AUTH}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || 'Login failed');
    }

    const data = await response.json();
    
    // Create API key if it doesn't exist
    let apiKey = data.data.apiKey;
    if (!apiKey) {
      apiKey = await createApiKey(data.data.accessToken);
    }
    
    // Save token, API key and user data to localStorage
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('user', JSON.stringify(data.data));
    return data.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

// Logout user
export function logoutUser() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('apiKey');
  localStorage.removeItem('user');
}

// Get current user
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Check if user is logged in
export function isAuthenticated() {
  return !!localStorage.getItem('accessToken');
}

// Fetch user profile with credits
export async function fetchUserProfile(username) {
  try {
    const token = localStorage.getItem('accessToken');
    const apiKey = localStorage.getItem('apiKey');

    const response = await fetch(`${API_AUCTION}/profiles/${username}?_listings=true`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Noroff-API-Key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    // Update localStorage with fresh user data including credits
    const currentUser = getCurrentUser();
    const updatedUser = { ...currentUser, ...result.data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return result.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

// Fetch auction listings
export async function fetchAuctionListings() {
  try {
    const response = await fetch(`${API_AUCTION}/listings?_bids=true`);
    
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

// Fetch auction by ID
export async function fetchAuctionById(id) {
  try {
    const response = await fetch(`${API_AUCTION}/listings/${id}`);
    
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