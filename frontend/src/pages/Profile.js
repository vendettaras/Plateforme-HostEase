import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './css/entreprise-detail.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';

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
        <div className="global">
            <div className="detail-entreprise">
                <div className="contenu">
                    <div className="logo-nom-container">
                        <div className="logo-detail">
                            <img src={entreprise.logo} alt="Logo de l'entreprise" />
                        </div>
                        <div className="no-icon">
                            <label>Nom de l'entreprise</label>
                            <input type="text" value={entreprise.nom_entreprise} readOnly />
                        </div>
                    </div>
                    <div className="entreprise-info">
                        <div className="input-container">
                            <i className="fas fa-id-card"></i>
                            <input type="text" value={entreprise.nif} readOnly />
                            <label>NIF :</label>
                        </div>
                        <div className="input-container">
                            <i className="fas fa-file-alt"></i>
                            <input type="text" value={entreprise.stat} readOnly />
                            <label>Stat :</label>
                        </div>
                        <div className="input-container">
                            <i className="fas fa-phone"></i>
                            <input type="text" value={entreprise.contact} readOnly />
                            <label>Contact :</label>
                        </div>
                        <div className="input-container">
                            <i className="fas fa-map-marker-alt"></i>
                            <input type="text" value={entreprise.localisation} readOnly />
                            <label>Localisation :</label>
                        </div>
                        <div className="input-container">
                            <i className="fas fa-user-tie"></i>
                            <input type="text" value={entreprise.proprio} readOnly />
                            <label>Propriétaire :</label>
                        </div>

                        {/* Afficher les informations de l'utilisateur */}
                        {user && (
                            <div className="user-info">
                                <h3>Informations Utilisateur</h3>
                                <p>Nom: {user.nom}</p> {/* Changez 'nom' en fonction de ce qui est dans le token */}
                                <p>Email: {user.email}</p> {/* Changez 'email' en fonction de ce qui est dans le token */}
                            </div>
                        )}

                        <div className="ajust">
                            <Link to="/entreprise-list">
                                <button className="retour">Retour</button>
                            </Link>
                            {authTokens && entreprise.user === user.id && ( // Vérifiez si l'utilisateur est le propriétaire
                                <button className="ajust-b" onClick={handleEdit}>Modifier</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EntrepriseDetail;
