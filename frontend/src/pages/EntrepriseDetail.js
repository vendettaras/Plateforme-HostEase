import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const EntrepriseDetail = () => {
    const { id } = useParams(); // Récupère l'ID depuis l'URL
    const navigate = useNavigate();
    const { authTokens, user } = useContext(AuthContext); // Récupère les tokens d'authentification et l'utilisateur
    const [entreprise, setEntreprise] = useState(null);

    useEffect(() => {
        const fetchEntreprise = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/entreprise/${id}/`);
                if (response.ok) {
                    const data = await response.json();
                    setEntreprise(data);
                } else {
                    console.error('Erreur lors de la récupération de l\'entreprise');
                }
            } catch (error) {
                console.error('Erreur réseau', error);
            }
        };

        fetchEntreprise();
    }, [id]);

    const handleEdit = () => {
        navigate(`/entreprise/${id}/modifier/`);
    };

    if (!entreprise) return <div>Chargement...</div>;

    return (
        <div>
            <h1>Détails de l'entreprise</h1>
            <div>
                <strong>Nom de l'entreprise :</strong> {entreprise.nom_entreprise}
            </div>
            <div>
                <strong>NIF :</strong> {entreprise.nif}
            </div>
            <div>
                <strong>Stat :</strong> {entreprise.stat}
            </div>
            <div>
                <strong>Email :</strong> {entreprise.mail}
            </div>
            <div>
                <strong>Contact :</strong> {entreprise.contact}
            </div>
            <div>
                <strong>Localisation :</strong> {entreprise.localisation}
            </div>
            <div>
                <strong>Propriétaire :</strong> {entreprise.proprio}
            </div>
            <div>
                <strong>Logo :</strong>
                <img src={entreprise.logo} alt="Logo de l'entreprise" style={{ width: '100px', height: 'auto' }} />
            </div>

            {/* Affiche le bouton de modification uniquement si l'utilisateur est authentifié et est le propriétaire de l'entreprise */}
            {authTokens && entreprise.user === user.id && (
                <button onClick={handleEdit}>Modifier</button>
            )}
        </div>
    );
};

export default EntrepriseDetail;
