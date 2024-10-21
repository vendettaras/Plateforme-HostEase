import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './css/styles.css';
import logo from "./image/HostEase_blanc.gif"

const Header = () => {
    const { user, logoutUser } = useContext(AuthContext);

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
                <>
                    <a><button onClick={logoutUser}>Logout</button></a>
                </>
            ) : (
                <Link to="/login">Login</Link>

            )}
            {user && <p>Hello {user.nom}</p>} {/* Affichez l'email ou le nom de l'utilisateur */}
        </div>
    );
};

export default Header;
