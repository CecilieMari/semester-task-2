import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout.jsx';
import Home from './components/Home/Home.jsx';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import Profil from './components/Profil/Profil.jsx';
import NewListing from './components/NewListing/NewListing.jsx';
import EditListing from './components/NewListing/EditListing.jsx';
import SingelListing from './components/Listing/SingelListing.jsx';
import AllListing from './components/Listing/AllListing.jsx';
import Searc from './components/Searc/Searc.jsx';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/new-listing" element={<NewListing />} />
          <Route path="/edit-listing/:id" element={<EditListing />} />
          <Route path="/auction/:id" element={<SingelListing />} />
          <Route path="/all-listings" element={<AllListing />} />
          <Route path="/search" element={<Searc />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
