import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './css/entreprise-detail.css';

const EntrepriseDetail = () => {
    const { id } = useParams(); // Récupère l'ID depuis l'URL
    const navigate = useNavigate();
    const { authTokens, user, updateToken } = useContext(AuthContext); // Récupère les tokens d'authentification et l'utilisateur
    const [entreprise, setEntreprise] = useState(null);

    useEffect(() => {
        const fetchEntreprise = async () => {
            try {
                let response = await fetch(`http://127.0.0.1:8000/api/entreprise/${id}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens?.access}`
                    },
                });

                if (response.status === 401) {
                    await updateToken();  // Rafraîchir le token
                    response = await fetch(`http://127.0.0.1:8000/api/entreprise/${id}/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authTokens?.access}`
                        },
                    });
                }

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
    }, [id, authTokens, updateToken]);


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
                        <div className="input-container no-icon">
                            <input type="text" value={entreprise.nom_entreprise} />
                            <label>Nom de l'entreprise</label>
                        </div>
                    </div>
                    <div className="entreprise-info">
                        <div className="input-container">
                            <i className="fas fa-id-card"></i>
                            <input type="text" value={entreprise.nif} />
                            <label>NIF :</label>
                        </div>
                        <div className="input-container">
                            <i className="fas fa-file-alt"></i>
                            <input type="text" value={entreprise.stat} />
                            <label>Stat :</label>
                        </div>
                        <div className="input-container">
                            <i className="fas fa-phone"></i>
                            <input type="text" value={entreprise.contact} />
                            <label>Contact :</label>
                        </div>
                        <div className="input-container">
                            <i className="fas fa-map-marker-alt"></i>
                            <input type="text" value={entreprise.localisation} />
                            <label>Localisation :</label>
                        </div>
                        <div className="input-container">
                            <i className="fas fa-user-tie"></i>
                            <input type="text" value={entreprise.proprio} />
                            <label>Propriétaire :</label>
                        </div>
                        <div className="ajust">
                            <Link to={`/entreprise-list`}>
                                <button className="retour">Retour</button>
                            </Link>
                            {authTokens && entreprise.user.id === user.id && (
                                <button onClick={handleEdit} className="ajust-b">Modifier</button>
                            )}
                        </div>
                    </div>
                    <div className="user_info">
                        <p>{entreprise.user.nom}</p>
                        <p>{entreprise.user.email}</p>
                        <img src={entreprise.user.photo}
                            alt="Logo de l'entreprise"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '1px solid #000080',
                                objectFit: 'cover',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EntrepriseDetail;