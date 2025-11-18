import React from 'react';
import Nav from '../Nav/Nav.jsx';
import Footer from '../Footer/Footer.jsx';

function Layout({ children }) {
  return (
    <div>
      <header>
        <Nav />
      </header>
      <main className="container mt-4">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
