import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaEdit } from 'react-icons/fa';
import './css/infoEedit.css';

const InfoEntrepriseEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authTokens, updateToken } = useContext(AuthContext);

    const [logoMessage, setLogoMessage] = useState('');
    const [photoMessage, setPhotoMessage] = useState('');

    const [entreprise, setEntreprise] = useState({
        nom_entreprise: '',
        nif: '',
        stat: '',
        contact: '',
        localisation: '',
        proprio: '',
        logo: '',
        user: {
            nom: '',
            photo: '',
        },
    });

    useEffect(() => {
        const fetchEntreprise = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/entreprise/${id}/`);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données');
                }
                const data = await response.json();
                setEntreprise(data);
            } catch (error) {
                console.error('Erreur:', error);
            }
        };

        fetchEntreprise();
    }, [id]);

    const handleEntrepriseChange = (e) => {
        const { name, value } = e.target;
        setEntreprise((prev) => ({ ...prev, [name]: value }));
    };

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setEntreprise((prev) => ({
            ...prev,
            user: { ...prev.user, [name]: value },
        }));
    };

    const handleSubmitInfo = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Ajoutez les informations de l'entreprise au FormData
        formData.append('nom_entreprise', entreprise.nom_entreprise);
        formData.append('nif', entreprise.nif);
        formData.append('stat', entreprise.stat);
        formData.append('contact', entreprise.contact);
        formData.append('localisation', entreprise.localisation);
        formData.append('proprio', entreprise.proprio);

        // Créez un objet pour les données utilisateur
        const userData = {
            id: entreprise.user.id, // ID de l'utilisateur
            nom: entreprise.user.nom,
        };

        // Ajoutez l'objet user au FormData comme JSON
        formData.append('user', JSON.stringify(userData));

        // Vérifiez que la photo est bien un fichier avant de l'ajouter
        if (entreprise.user.photo && entreprise.user.photo instanceof File) {
            formData.append('user.photo', entreprise.user.photo);
        }

        try {
            let response = await fetch(`http://127.0.0.1:8000/api/entreprise/${id}/modifier/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authTokens?.access}`,
                    // Ne définissez pas 'Content-Type' ici, car fetch le gère pour FormData.
                },
                body: formData,
            });

            // Vérifiez si la réponse est une erreur d'authentification (401)
            if (response.status === 401) {
                await updateToken();  // Rafraîchir le token
                response = await fetch(`http://127.0.0.1:8000/api/entreprise/${id}/modifier/`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${authTokens?.access}`,
                    },
                    body: formData, // Renvoie le formData pour la seconde tentative
                });
            }

            // Vérifiez la réponse
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erreur:', errorData);
                throw new Error('Erreur lors de la mise à jour de l\'entreprise');
            } else {
                navigate(`/entreprise/${id}`);
            }

            const data = await response.json();
            console.log('Données mises à jour:', data);
            // Gérer la redirection ou notification ici

        } catch (error) {
            console.error('Erreur:', error);
            // Affichez une notification à l'utilisateur si nécessaire
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

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Mettez à jour uniquement la photo de l'utilisateur dans l'état
            setEntreprise((prevState) => ({
                ...prevState,
                user: {
                    ...prevState.user,  // Gardez les autres propriétés de l'utilisateur
                    photo: URL.createObjectURL(file), // Pour un aperçu immédiat
                },
            }));
        }
    };

    const handleSubmitPhoto = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('photo', e.target.photo.files[0]);

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
                setPhotoMessage('Logo mis à jour avec succès.');
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
                        <div className="input-container no-icon">
                            <input type="text" name="nom_entreprise" onChange={handleEntrepriseChange} value={entreprise.nom_entreprise} />
                            <label>Nom de l'entreprise :</label>
                        </div>
                        <div className="input-container">
                            <i className="fas fa-id-card"></i>
                            <input type="text" name="nif" onChange={handleEntrepriseChange} value={entreprise.nif} />
                            <label>NIF :</label>
                        </div>
                        <div className="input-container">
                            <i className="fas fa-file-alt"></i>
                            <input type="text" name="stat" onChange={handleEntrepriseChange} value={entreprise.stat} />
                            <label>Stat :</label>
                        </div>
                        <div className="input-container">
                            <i className="fas fa-phone"></i>
                            <input type="text" name="contact" onChange={handleEntrepriseChange} value={entreprise.contact} />
                            <label>Contact :</label>
                        </div>
                        <div className="input-container">
                            <i className="fas fa-map-marker-alt"></i>
                            <input type="text" name="localisation" onChange={handleEntrepriseChange} value={entreprise.localisation} />
                            <label>Localisation :</label>
                        </div>
                        <div className="input-container">
                            <i className="fas fa-user-tie"></i>
                            <input type="text" name="proprio" onChange={handleEntrepriseChange} value={entreprise.proprio} />
                            <label>Propriétaire :</label>
                        </div>
                        <div className="ajust">
                            <Link to={`/entreprise-list`}>
                                <button className="retour">Retour</button>
                            </Link>
                        </div>
                    </div>
                    <div className="button-container">
                        <button type="submit">Enregistrer</button>
                    </div>
                </form>
            </div>
            <div>
                {/* Section pour afficher et modifier les utilisateurs */}
                <h2>Informations de l'Utilisateur</h2>
                <label>
                    Nom:
                    <input
                        type="text"
                        name="nom"
                        value={entreprise.user.nom}
                        onChange={handleUserChange}
                    />
                </label>
                <label>
                    <p>
                        Email: {entreprise.user.email}
                    </p>
                </label>
                <div className="logo-nom-container">
                    <form onSubmit={handleSubmitPhoto}>
                        <div className="logo-detail1-container">
                            <div className="logo-detail1">
                                <img src={entreprise.user.photo} alt="Logo de l'entreprise" />
                                <label htmlFor="photo-input" className="logo-upload">
                                    <span><FaEdit className="edit-icon" /></span>
                                </label>
                                <input
                                    id="photo-input"
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            <div className="button-container">
                                <button type="submit">Soumettre</button>
                            </div>
                        </div>
                    </form>
                    {photoMessage && <p>{photoMessage}</p>}
                </div>
            </div>
        </div>
    );
};

export default InfoEntrepriseEdit;