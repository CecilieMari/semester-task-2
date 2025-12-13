import { Navbar, Nav as BootstrapNav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './Nav.module.css';
import { isAuthenticated, logoutUser } from '../api/Api';

function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    window.location.href = '/'; // Redirect to home
  };

  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate('/profil');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <div style={{ height: '15px', backgroundColor: '#9A4E15' }}></div>
      <div className={styles.logoSection}>
        {/* Left side - Search */}
        <div className={styles.leftSection}>
          <i className="bi bi-search" style={{ fontSize: '24px', marginRight: '8px' }}></i>
          <span className={styles.sectionText}>Search</span>
        </div>
        
        {/* Center - Logo */}
        <div className={styles.centerSection}>
          <img 
            src="../image/home.png" 
            alt="Logo" 
            className={styles.logo}
          />
          <h2 className={styles.title}>
            Auction House
          </h2>
          <p className={styles.tagline}>
            DISCOVER BID WIN
          </p>
        </div>
        
        {/* Right side - Account */}
        <div className={styles.rightSection} onClick={handleAccountClick}>
          <i className="bi bi-person-circle" style={{ fontSize: '24px', marginRight: '8px' }}></i>
          <span className={styles.sectionText}>Account</span>
        </div>
      </div>
      <Navbar expand="lg" className={styles.navbar}>
        <Container fluid>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav" className="justify-content-center">
            <BootstrapNav className="w-100 justify-content-around">
              <BootstrapNav.Link as={Link} to="/" className={styles.navLink}>Buy</BootstrapNav.Link>
              <BootstrapNav.Link as={Link} to="/all-listings" className={styles.navLink}>All Listings</BootstrapNav.Link>
              <BootstrapNav.Link as={Link} to="/about" className={styles.navLink}>About</BootstrapNav.Link>
              <BootstrapNav.Link as={Link} to="/contact" className={styles.navLink}>Contact</BootstrapNav.Link>
              
              {isLoggedIn ? (
                <>
                  <BootstrapNav.Link as={Link} to="/profil" className={styles.navLink}>Profile</BootstrapNav.Link>
                  <BootstrapNav.Link onClick={handleLogout} className={styles.navLink} style={{ cursor: 'pointer' }}>Logout</BootstrapNav.Link>
                </>
              ) : (
                <>
                  <BootstrapNav.Link as={Link} to="/login" className={styles.navLink}>Login</BootstrapNav.Link>
                  <BootstrapNav.Link as={Link} to="/register" className={styles.navLink}>Register</BootstrapNav.Link>
                </>
              )}
            </BootstrapNav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Nav;