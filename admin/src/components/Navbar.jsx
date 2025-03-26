import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth(); // Access user from AuthContext here

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        {user && <li><Link to="/admin">Admin Panel</Link></li>}
      </ul>
    </nav>
  );
};

export default Navbar;