import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const InfoEntrepriseEdit = () => {
    const { id } = useParams(); // Récupère l'ID depuis l'URL
    const navigate = useNavigate();
    const { authTokens, updateToken, user } = useContext(AuthContext); // Inclut updateToken

    const [entreprise, setEntreprise] = useState({
        nom_entreprise: '',
        nif: '',
        stat: '',
        mail: '',
        contact: '',
        localisation: '',
        proprio: '',
        logo: '',
    });

    useEffect(() => {
        const fetchEntreprise = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/entreprise/${id}/modifier/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens?.access}` // Utilise le token d'accès
                    },
                });

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

        if (id) {
            fetchEntreprise();
        }
    }, [id, authTokens]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mise à jour du token si nécessaire
        if (updateToken) {
            await updateToken();
        }

        try {
            let response = await fetch(`http://127.0.0.1:8000/api/entreprise/${id}/modifier/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens?.access}` // Utilise le token d'accès pour l'autorisation
                },
                body: JSON.stringify(entreprise),
            });

            if (response.ok) {
                navigate('/info-entreprise-list'); // Redirige vers la liste des entreprises après modification
            } else {
                const data = await response.json();
                console.error('Error:', data);
                alert(data.detail || 'Une erreur est survenue');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'entreprise', error);
        }
    };

    // Gestion des modifications du formulaire
    const handleChange = (e) => {
        setEntreprise({
            ...entreprise,
            [e.target.name]: e.target.value
        });
    };

    // Fonction pour supprimer l'entreprise
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette entreprise ?");
        if (confirmDelete) {
            // Mise à jour du token si nécessaire
            if (updateToken) {
                await updateToken();
            }

            const response = await fetch(`http://127.0.0.1:8000/api/info-entreprise/${id}/delete/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authTokens?.access}`
                },
            });

            if (response.ok) {
                console.log("Entreprise supprimée avec succès");
                navigate('/info-entreprise-list'); // Redirige vers la liste des entreprises après suppression
            } else {
                console.error('Erreur lors de la suppression de l\'entreprise');
            }
        }
    };

    return (
        <div>
            <h1>Modifier les informations de l'entreprise</h1>
            {user?.id === entreprise.user ? ( // Vérifie si l'utilisateur est le propriétaire de l'entreprise
                <form onSubmit={handleSubmit}>
                    <label>
                        Nom de l'entreprise:
                        <input type="text" name="nom_entreprise" value={entreprise.nom_entreprise} onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        NIF:
                        <input type="text" name="nif" value={entreprise.nif} onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        Stat:
                        <input type="text" name="stat" value={entreprise.stat} onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        Email:
                        <input type="email" name="mail" value={entreprise.mail} onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        Contact:
                        <input type="text" name="contact" value={entreprise.contact} onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        Localisation:
                        <input type="text" name="localisation" value={entreprise.localisation} onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        Propriétaire:
                        <input type="text" name="proprio" value={entreprise.proprio} onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        Logo:
                        <input type="text" name="logo" value={entreprise.logo} onChange={handleChange} />
                    </label>
                    <br />
                    <button type="submit">Modifier</button>
                    <button type="button" onClick={handleDelete}>Supprimer l'entreprise</button>
                </form>
            ) : (
                <p>Vous n'avez pas les droits pour modifier ces informations.</p>
            )}
        </div>
    );
};

export default InfoEntrepriseEdit;
