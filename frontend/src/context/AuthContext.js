import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem('authTokens') 
            ? JSON.parse(localStorage.getItem('authTokens')) 
            : null
    );
    const [user, setUser] = useState(() =>
        localStorage.getItem('authTokens') 
            ? jwtDecode(localStorage.getItem('authTokens')) 
            : null
    );

    const navigate = useNavigate();

    // Fonction pour le login de l'utilisateur
    const loginUser = async (e) => {
        e.preventDefault();
        let response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'mail': e.target.mail.value,
                'password': e.target.password.value,
            }),
        });

        let data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));
            navigate('/');
        } else {
            alert('Something went wrong!');
        }
    };

    // Fonction pour le logout de l'utilisateur
    const logoutUser = useCallback(() => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/login');
    }, [navigate]);

    const updateToken = useCallback(async () => {
        let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'refresh': authTokens?.refresh }),
        });

        let data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));
        } else {
            console.error('Erreur lors du renouvellement du token');
        }
    }, [authTokens]);

    const isAdmin = user?.is_staff;

    const contextData = {
        user,
        authTokens,
        loginUser,   // Ajout de la fonction de connexion
        logoutUser,  // Ajout de la fonction de déconnexion
        isAdmin,     // Vérification de l'utilisateur admin
        updateToken, // Mise à jour du token
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
