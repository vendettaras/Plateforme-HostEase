import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const OffreCreate = () => {
    const [nomOffre, setNomOffre] = useState('');
    const [prix, setPrix] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const { updateToken, authTokens, user } = useContext(AuthContext); // Assurez-vous que ces valeurs sont présentes

    const handleSubmit = async (e) => {
        e.preventDefault();

        await updateToken(); // Renouvelle le token avant de faire la requête

        console.log("updateToken function:", updateToken); // Ajoutez cette ligne pour voir si updateToken est bien disponible

        if (updateToken) {
            await updateToken();
        } else {
            console.error('updateToken is not available in the context');
        }


        const response = await fetch('http://127.0.0.1:8000/api/offre/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}` // Utilise le token d'accès mis à jour
            },
            body: JSON.stringify({
                nom_offre: nomOffre,
                prix: parseFloat(prix),
                description: description
            })
        });

        if (response.ok) {
            navigate('/offre-list');
        } else {
            const data = await response.json();
            console.error('Error:', data);
            alert(data.detail || 'Une erreur est survenue');
        }
    };

    return (
        <div>
            <h2>Ajouter une offre</h2>
            {user?.is_staff ? ( // Afficher le formulaire uniquement si l'utilisateur est administrateur
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nom de l'offre:</label>
                        <input
                            type="text"
                            value={nomOffre}
                            onChange={(e) => setNomOffre(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Prix:</label>
                        <input
                            type="number"
                            value={prix}
                            onChange={(e) => setPrix(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <button type="submit">Ajouter l'offre</button>
                </form>
            ) : (
                <p>Vous devez être un administrateur pour ajouter une offre.</p>
            )}
        </div>
    );
};

export default OffreCreate;
