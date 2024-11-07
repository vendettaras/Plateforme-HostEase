import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Paiement = () => {
    const { offreId } = useParams(); // Récupère l'ID de l'offre à partir de l'URL
    const [refPaiement, setRefPaiement] = useState('');
    const [motifPaiement, setMotifPaiement] = useState('');
    const { authTokens, updateToken, user } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Vérifiez les données avant de les envoyer
        console.log('ID de l\'entreprise:', user?.entreprise_id);  // Log pour vérifier
        console.log('ID de l\'offre:', offreId);
    
        const paymentData = {
            ref_payement: refPaiement,
            motif_payement: motifPaiement,
            offre: parseInt(offreId, 10),  // Assurez-vous que c'est un entier
            entreprise: parseInt(user?.entreprise_id, 10),  // Assurez-vous que c'est un entier
        };
    
        console.log(paymentData);  // Log pour vérifier les données envoyées
    
        try {
            // Effectuez la requête initiale pour soumettre le paiement
            let response = await fetch(`http://127.0.0.1:8000/api/paiement/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens?.access}`
                },
                body: JSON.stringify(paymentData),  // Envoi des données dans le corps de la requête
            });
    
            // Vérifiez si le token est invalide (status 401)
            if (response.status === 401) {
                console.log('Token non valide, mise à jour du token...');
                await updateToken();  // Fonction pour mettre à jour le token
    
                // Recréez la requête après la mise à jour du token
                response = await fetch(`http://127.0.0.1:8000/api/paiement/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens?.access}`
                    },
                    body: JSON.stringify(paymentData),  // Envoi des données dans le corps de la requête
                });
            }
    
            // Si la réponse est valide (200-299), traiter les données
            if (response.ok) {
                const data = await response.json();
                console.log('Paiement réussi:', data);
                // Vous pouvez rediriger ou afficher un message de succès ici
            } else {
                // Si la réponse n'est pas OK (par exemple, erreur 400), affichez les erreurs
                const errorData = await response.json();
                console.error('Erreur de paiement:', errorData.errors);
                // Vous pouvez afficher les erreurs à l'utilisateur ici
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du paiement:', error);
            // Vous pouvez afficher un message d'erreur global ici
        }
    };    
       

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Référence de paiement:</label>
                <input
                    type="text"
                    value={refPaiement}
                    onChange={(e) => setRefPaiement(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Motif de paiement:</label>
                <input
                    type="text"
                    value={motifPaiement}
                    onChange={(e) => setMotifPaiement(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Soumettre le paiement</button>
        </form>
    );
};

export default Paiement;
