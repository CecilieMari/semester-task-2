import { Navbar, Nav as BootstrapNav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './Nav.module.css';

function Nav() {
  return (
    <>
      <div style={{ height: '15px', backgroundColor: '#9A4E15' }}></div>
      <div className={styles.logoSection}>
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
      <Navbar expand="lg" className={styles.navbar}>
        <Container fluid>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav" className="justify-content-center">
            <BootstrapNav className="w-100 justify-content-around">
              <BootstrapNav.Link as={Link} to="/" className={styles.navLink}>Buy</BootstrapNav.Link>
              <BootstrapNav.Link as={Link} to="/sell" className={styles.navLink}>Sell</BootstrapNav.Link>
              <BootstrapNav.Link as={Link} to="/about" className={styles.navLink}>About</BootstrapNav.Link>
              <BootstrapNav.Link as={Link} to="/contact" className={styles.navLink}>Contact</BootstrapNav.Link>
            </BootstrapNav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Nav;