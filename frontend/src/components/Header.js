import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './css/styles.css';
import logo from "./image/HostEase_blanc.gif";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    return (
        <div className="header">
            <img src={logo} alt="Logo" className="logo" />
            <div className="links">
                <Link to="/">Accueil</Link>
                <Link to="/offre-list">Offres</Link>
                <Link to="/Entreprise-list">Entreprises</Link>
                <a href="#">Contact</a>
            </div>
            {user ? (
                <div className="user-section dropdown">
                    <div className="user-info" onClick={toggleDropdown} id="userDropdown" role="button" aria-expanded={dropdownOpen}>
                        <FontAwesomeIcon icon={faUser} className="user-avatar" />
                        <span className="user-name">{user.nom}</span>
                        <i className={`fas fa-chevron-down chevron ${dropdownOpen ? 'open' : ''}`}></i>
                    </div>
                    {dropdownOpen && (
                        <ul className="dropdown-menu my-custom-dropdown show" aria-labelledby="userDropdown">
                            <li>
                                <Link to={`/user/${user.id}/details`} className="dropdown-item">Profil</Link>
                            </li>
                            <li>
                                <button className="dropdown-item" onClick={logoutUser}>Logout</button>
                            </li>
                        </ul>
                    )}
                </div>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </div>
    );
};

export default Header;
