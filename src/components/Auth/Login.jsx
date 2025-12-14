// Login component for user authentication
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from './login.module.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://v2.api.noroff.dev/auth/login', {
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
            
            // Lagre tokens og brukerinfo
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('userName', data.data.name);
            localStorage.setItem('userEmail', data.data.email);
            
            if (data.data.bio) {
                localStorage.setItem('userBio', data.data.bio);
            }
            if (data.data.avatar?.url) {
                localStorage.setItem('userAvatar', data.data.avatar.url);
            }

            // Opprett API-nøkkel
            const apiKeyResponse = await fetch('https://v2.api.noroff.dev/auth/create-api-key', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.data.accessToken}`
                },
                body: JSON.stringify({ name: 'API Key' })
            });

            if (apiKeyResponse.ok) {
                const apiKeyData = await apiKeyResponse.json();
                localStorage.setItem('apiKey', apiKeyData.data.key);
            }

            // Vent litt for å sikre at localStorage er oppdatert
            await new Promise(resolve => setTimeout(resolve, 100));

            // Trigger en storage event for å oppdatere Nav
            window.dispatchEvent(new Event('storage'));
            
            // Naviger til forsiden
            navigate('/');
            
            // Force reload for å sikre at alt oppdateres
            window.location.reload();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h2 className={styles.loginTitle}>Login</h2>
                {error && <div className={styles.error}>{error}</div>}
                
                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={styles.loginButton}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className={styles.registerLink}>
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
