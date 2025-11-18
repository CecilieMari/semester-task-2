import React from "react";
import { Link } from "react-router-dom";
import Styles from "./footer.module.css";

function Footer() {
    return (
        <footer className={Styles.footer}>
            <div className="container">
                <div className="row py-4">
                    <div className="col-md-4">
                        <div className={Styles.logoSection}>
                                <img 
                                  src="../image/home.png" 
                                  alt="Logo" 
                                  className={Styles.logo}
                                />
                                <h2 className={Styles.title}>
                                    Auction House
                                </h2>
                            </div>
                    </div>
                    <div className="col-md-4">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/" className={Styles.footerLink}>Home</Link></li>
                            <li><Link to="/about" className={Styles.footerLink}>About</Link></li>
                            <li><Link to="/contact" className={Styles.footerLink}>Contact</Link></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Follow Us</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className={Styles.footerLink}>Facebook</a></li>
                            <li><a href="#" className={Styles.footerLink}>Instagram</a></li>
                            <li><a href="#" className={Styles.footerLink}>Twitter</a></li>
                        </ul>
                    </div>
                </div>
                <div className="text-center pt-3 border-top">
                    <p className="mb-0">© 2025 Auction House. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;