import React, { useEffect, useState } from 'react';

const GestionUser = () => {
  const [offreEntreprises, setOffreEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Effectuer la récupération des données
    fetch('http://127.0.0.1:8000/api/gestion-utilisateur/')
      .then(response => response.json())
      .then(data => {
        setOffreEntreprises(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Gestion des utilisateurs</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Entreprise</th>
            <th>Offre</th>
            <th>Date de début</th>
            <th>Date d'expiration</th>
            <th>Référence de paiement</th>
            <th>Motif de paiement</th>
          </tr>
        </thead>
        <tbody>
          {offreEntreprises.map((offreEntreprise, index) => (
            <tr key={offreEntreprise.id}>
              {/* Affichage de l'ID de l'offre */}
              <td>{offreEntreprise.entreprise.user.email || 'N/A'}</td>
              
              {/* Affichage du nom de l'entreprise */}
              <td>{offreEntreprise.entreprise.nom_entreprise || 'N/A'}</td>
              
              {/* Affichage du nom de l'offre */}
              <td>{offreEntreprise.offre.nom_offre || 'N/A'}</td>
              
              {/* Affichage des dates */}
              <td>{new Date(offreEntreprise.date_begin).toLocaleDateString()}</td>
              <td>{new Date(offreEntreprise.date_exp).toLocaleDateString()}</td>
              
              {/* Affichage des informations de paiement */}
              <td>{offreEntreprise.ref_payement || 'N/A'}</td>
              <td>{offreEntreprise.motif_payement || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionUser;
