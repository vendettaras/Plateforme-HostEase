import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaEdit } from 'react-icons/fa';
import './css/infoEedit.css';

const InfoEntrepriseEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authTokens, updateToken, user } = useContext(AuthContext);

    const [entreprise, setEntreprise] = useState({
        nom_entreprise: '',
        nif: '',
        stat: '',
        contact: '',
        localisation: '',
        proprio: '',
        logo: '',
        user: user.id,  // Ajout du champ user avec l'ID de l'utilisateur
    });

    const [logoMessage, setLogoMessage] = useState('');
    const [utilisateurs, setUtilisateurs] = useState([]); // État pour stocker les utilisateurs
    const [utilisateurModif, setUtilisateurModif] = useState(null); // État pour l'utilisateur à modifier

    useEffect(() => {
        const fetchEntreprise = async () => {
            try {
                let response = await fetch(`http://127.0.0.1:8000/api/entreprise/${id}/modifier/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens?.access}`
                    },
                });

                if (response.status === 401) {
                    // Rafraîchir le token si nécessaire
                    await updateToken();
                    response = await fetch(`http://127.0.0.1:8000/api/entreprise/${id}/modifier/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authTokens?.access}`
                        },
                    });
                }

                if (response.ok) {
                    let data = await response.json();
                    setEntreprise(data);
                } else {
                    console.error('Erreur lors de la récupération de l\'entreprise');
                }
            } catch (error) {
                console.error('Erreur réseau', error);
            }
        };

        const fetchUtilisateurs = async () => {
            try {
                let response = await fetch(`http://127.0.0.1:8000/api/utilisateurs/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens?.access}`
                    },
                });

                if (response.ok) {
                    let data = await response.json();
                    setUtilisateurs(data);
                } else {
                    console.error('Erreur lors de la récupération des utilisateurs');
                }
            } catch (error) {
                console.error('Erreur réseau', error);
            }
        };

        if (id) {
            fetchEntreprise();
            fetchUtilisateurs(); // Récupérer les utilisateurs associés à l'entreprise
        }
    }, [id, authTokens, updateToken]);

    const handleSubmitInfo = async (e) => {
        e.preventDefault();

        const updatedData = {
            nom_entreprise: entreprise.nom_entreprise,
            nif: entreprise.nif,
            stat: entreprise.stat,
            contact: entreprise.contact,
            localisation: entreprise.localisation,
            proprio: entreprise.proprio,
            user: entreprise.user,  // Inclure le champ user dans les données mises à jour
        };

        try {
            let response = await fetch(`http://127.0.0.1:8000/api/entreprise/${id}/modifier/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authTokens?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData),
            });

            if (response.status === 401) {
                await updateToken();
                response = await fetch(`http://127.0.0.1:8000/api/entreprise/${id}/modifier/`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${authTokens?.access}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData),
                });
            }

            if (response.ok) {
                navigate(`/entreprise/${id}`); // Redirige vers la liste des entreprises
            } else {
                const data = await response.json();
                console.error('Error:', data);
                alert(data.detail || 'Une erreur est survenue lors de la mise à jour des informations.');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'entreprise', error);
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEntreprise((prevState) => ({
                ...prevState,
                logo: URL.createObjectURL(file) // Pour un aperçu immédiat
            }));
        }
    };

    const handleSubmitLogo = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('logo', e.target.logo.files[0]);

        try {
            let response = await fetch(`http://127.0.0.1:8000/api/entreprise/${id}/modifier/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authTokens?.access}`,
                },
                body: formData,
            });

            if (response.status === 401) {
                await updateToken();
                response = await fetch(`http://127.0.0.1:8000/api/entreprise/${id}/modifier/`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${authTokens?.access}`,
                    },
                    body: formData,
                });
            }

            if (response.ok) {
                setLogoMessage('Logo mis à jour avec succès.');
                window.location.reload();
            } else {
                const data = await response.json();
                console.error('Error:', data);
                alert(data.detail || 'Une erreur est survenue lors de la mise à jour du logo.');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du logo', error);
        }
    };

    const handleChange = (e) => {
        setEntreprise({
            ...entreprise,
            [e.target.name]: e.target.value
        });
    };

    const handleModifierUtilisateur = (utilisateur) => {
        setUtilisateurModif(utilisateur); // Pré-remplir le formulaire de modification
    };

    const handleSubmitUtilisateurModif = async (e) => {
        e.preventDefault();

        // Ici, vous devez préparer les données pour la mise à jour de l'utilisateur
        const updatedUserData = {
            // Ajoutez ici les champs que vous souhaitez mettre à jour
            // par exemple: nom: utilisateurModif.nom, email: utilisateurModif.email, etc.
        };

        try {
            let response = await fetch(`http://127.0.0.1:8000/api/utilisateur/${utilisateurModif.id}/modifier/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authTokens?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUserData),
            });

            if (response.ok) {
                setUtilisateurModif(null); // Réinitialiser l'utilisateur à modifier
                window.location.reload(); // Rafraîchir la page pour voir les modifications
            } else {
                const data = await response.json();
                console.error('Error:', data);
                alert(data.detail || 'Une erreur est survenue lors de la mise à jour de l\'utilisateur.');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
        }
    };

    return (
        <div className="global-1"> {/* Élément parent englobant tout le JSX */}
            <div className="contenu-1">
                <div className="logo-nom-container">
                    <form onSubmit={handleSubmitLogo}>
                        <div className="logo-detail1-container">
                            <div className="logo-detail1">
                                <img src={entreprise.logo} alt="Logo de l'entreprise" />
                                <label htmlFor="logo-input" className="logo-upload">
                                    <span><FaEdit className="edit-icon" /></span>
                                </label>
                                <input
                                    id="logo-input"
                                    type="file"
                                    name="logo"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            <div className="button-container">
                                <button type="submit">Soumettre</button>
                            </div>
                        </div>
                    </form>
                    {logoMessage && <p>{logoMessage}</p>}
                </div>
                <form onSubmit={handleSubmitInfo}>
                    <div className="entreprise-info">
                        <div className="input-container">
                            <img src={entreprise.logo} alt="Logo de l'entreprise" />
                            <input
                                type="text"
                                name="nom_entreprise"
                                value={entreprise.nom_entreprise}
                                onChange={handleChange}
                                placeholder="Nom de l'entreprise"
                                required
                            />
                        </div>
                        <div className="input-container">
                            <input
                                type="text"
                                name="nif"
                                value={entreprise.nif}
                                onChange={handleChange}
                                placeholder="NIF"
                                required
                            />
                        </div>
                        <div className="input-container">
                            <input
                                type="text"
                                name="stat"
                                value={entreprise.stat}
                                onChange={handleChange}
                                placeholder="STAT"
                                required
                            />
                        </div>
                        <div className="input-container">
                            <input
                                type="text"
                                name="contact"
                                value={entreprise.contact}
                                onChange={handleChange}
                                placeholder="Contact"
                                required
                            />
                        </div>
                        <div className="input-container">
                            <input
                                type="text"
                                name="localisation"
                                value={entreprise.localisation}
                                onChange={handleChange}
                                placeholder="Localisation"
                                required
                            />
                        </div>
                        <div className="input-container">
                            <input
                                type="text"
                                name="proprio"
                                value={entreprise.proprio}
                                onChange={handleChange}
                                placeholder="Propriétaire"
                                required
                            />
                        </div>
                    </div>
                    <div className="button-container">
                        <button type="submit">Enregistrer</button>
                    </div>
                </form>
            </div>
            {/* Section pour afficher et modifier les utilisateurs */}
            <div className="utilisateurs-container">
                <h2>Utilisateurs associés</h2>
                <ul>
                    {utilisateurs.map((utilisateur) => (
                        <li key={utilisateur.id}>
                            {utilisateur.nom} - {utilisateur.email}
                            <button onClick={() => handleModifierUtilisateur(utilisateur)}>Modifier</button>
                        </li>
                    ))}
                </ul>

                {utilisateurModif && (
                    <div className="modif-utilisateur">
                        <h3>Modifier l'utilisateur</h3>
                        <form onSubmit={handleSubmitUtilisateurModif}>
                            <input
                                type="text"
                                name="nom"
                                value={utilisateurModif.nom}
                                onChange={(e) => setUtilisateurModif({ ...utilisateurModif, nom: e.target.value })}
                                placeholder="Nom"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                value={utilisateurModif.email}
                                onChange={(e) => setUtilisateurModif({ ...utilisateurModif, email: e.target.value })}
                                placeholder="Email"
                                required
                            />
                            <div className="button-container">
                                <button type="submit">Enregistrer</button>
                                <button type="button" onClick={() => setUtilisateurModif(null)}>Annuler</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfoEntrepriseEdit;
