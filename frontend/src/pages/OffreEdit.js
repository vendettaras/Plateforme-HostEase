import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const OffreEdit = () => {
    const { id } = useParams(); // Récupère l'ID depuis l'URL
    const navigate = useNavigate();
    const { updateToken, authTokens, user } = useContext(AuthContext); // Récupère les tokens et updateToken depuis le contexte

    const [offer, setOffer] = useState({
        nom_offre: '',
        prix: '',
        description: ''
    });

    // Récupération des données de l'offre
    useEffect(() => {

        const fetchOffer = async () => {
            try {
                console.log(`Fetching offer with ID: ${id}`); // Ajoutez ce log
                const response = await fetch(`http://127.0.0.1:8000/api/offre/${id}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens?.access}` // Utilise le token d'accès mis à jour
            },
                });
                
                console.log('Response status:', response.status); // Log du statut de la réponse
                
                if (response.ok) {
                    let data = await response.json();
                    console.log('Fetched data:', data); // Log des données récupérées
                    setOffer(data);
                } else {
                    console.error('Erreur lors de la récupération de l\'offre');
                }
            } catch (error) {
                console.error('Erreur réseau', error);
            }
        };
        

        if (id) { // S'assurer que l'ID est défini avant de faire l'appel à l'API
            fetchOffer();
        }
    }, [id]);

    // Gestion de la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mise à jour du token si nécessaire
        if (updateToken) {
            await updateToken();
        }

        try {
            let response = await fetch(`http://127.0.0.1:8000/api/offre/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens?.access}` // Utilise le token d'accès pour l'autorisation
                },
                body: JSON.stringify(offer),
            });

            if (response.ok) {
                navigate('/offre-list'); // Redirige vers la liste des offres après modification
            } else {
                const data = await response.json();
                console.error('Error:', data);
                alert(data.detail || 'Une erreur est survenue');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'offre', error);
        }
    };

    // Gestion des modifications du formulaire
    const handleChange = (e) => {
        setOffer({
            ...offer,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            <h1>Modifier l'offre</h1>
            {user?.is_staff ? ( // Vérifie si l'utilisateur est un administrateur
                <form onSubmit={handleSubmit}>
                    <label>
                        Nom de l'offre:
                        <input type="text" name="nom_offre" value={offer.nom_offre} onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        Prix:
                        <input type="number" name="prix" value={offer.prix} onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        Description:
                        <textarea name="description" value={offer.description} onChange={handleChange} />
                    </label>
                    <br />
                    <button type="submit">Modifier</button>
                </form>
            ) : (
                <p>Vous devez être un administrateur pour modifier une offre.</p>
            )}
        </div>
    );
};

export default OffreEdit;
