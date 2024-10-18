import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import AuthContext from '../context/AuthContext';

const EntrepriseList = () => {
    const navigate = useNavigate();
    // const { user } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [entreprises, setEntreprises] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchEntreprises = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/entreprises/');
        const data = await response.json();
        setEntreprises(data);
        // setError(error.message);
        setLoading(false);
      };
  
      fetchEntreprises();
    }, []);
  
    if (loading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <p>{error}</p>;
    }
  
    // const handleEditClick = (id) => {
    //   navigate(`/entreprise/${id}/modifier`);
    // };

    const handleViewDetails = (id) => {
      navigate(`/entreprise/${id}`);  // Redirige vers la page de détail d'une entreprise
    };
  
    return (
      <div>
        <h2>Liste des Entreprises</h2>
        {entreprises.length > 0 ? (
          entreprises.map((entreprise) => {
            if (!entreprise || !entreprise.id) return null;
            return (
              <div key={entreprise.id}>
                <h3>{entreprise.nom_entreprise}</h3>
                <p>{entreprise.contact}</p>
                <p>{entreprise.localisation}</p>
                {/* Afficher le bouton Modifier uniquement si l'ID de l'utilisateur correspond à la clé étrangère dans InfoEntreprise */}
                {/* {entreprise.user === user.id && ( // Modifiez cette ligne
                  <button onClick={() => handleEditClick(entreprise.id)}>Modifier</button>
                )} */}
                <button onClick={() => handleViewDetails(entreprise.id)}>
                  Voir le détail
                </button>
              </div>
            );
          })
        ) : (
          <p>Aucune entreprise trouvée.</p>
        )}
      </div>
    );
  };
  
  export default EntrepriseList;
  