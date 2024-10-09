import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
    const { user, logoutUser, isAdmin } = useContext(AuthContext);

    return (
        <div>
            <Link to="/">Accueil</Link>
            <Link to="/offre-list">Offres</Link>
            <span> | </span>
            {user ? (
                <>
                    <button onClick={logoutUser}>Logout</button>
                    {isAdmin && (
                        <Link to="/create-offre">
                            <button>Ajouter une offre</button>
                        </Link>
                    )}
                </>
            ) : (
                <Link to="/login">Login</Link>
            )}
            {user && <p>Hello {user.mail}</p>} {/* Affichez l'email ou le nom de l'utilisateur */}
        </div>
    );
};

export default Header;
