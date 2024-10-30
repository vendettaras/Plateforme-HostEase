import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './css/entrepriseList.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const EntrepriseList = () => {
  const navigate = useNavigate();
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = 'http://127.0.0.1:8000/';

  useEffect(() => {
    const fetchEntreprises = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/entreprises/');
      const data = await response.json();
      setEntreprises(data);
      setLoading(false);
    };

    fetchEntreprises();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleViewDetails = (id) => {
    navigate(`/entreprise/${id}`);  // Redirige vers la page de détail d'une entreprise
  };

  return (
    <section className="list-entreprise">
      <h3 className="nos-client">
        <span className="text-color1">Nos </span>
        <span className="text-color2">clients</span>
      </h3>
      <div className="container">
        <div className="row">
          {entreprises.length > 0 ? (
            entreprises.map((entreprise) => {
              if (!entreprise || !entreprise.id) return null;
              return (
                <div className="col-3" key={entreprise.id}>
                  <div className="carte-entreprise">
                    <p>
                      <img src={`${baseUrl}${entreprise.logo}`} alt={entreprise.nom_entreprise} style={{ width: 'auto', height: '50px' }} />
                      <span className="nom-entreprise">{entreprise.nom_entreprise}</span>
                    </p>
                    <hr />
                    <p className="info">
                      <i className="fas fa-map-marker-alt"></i> {entreprise.localisation}
                    </p>
                    <p className="info">
                      <i className="fas fa-phone"></i> {entreprise.contact}
                    </p>
                    <p className="en-savoir-plus">
                    <button onClick={() => handleViewDetails(entreprise.id)} className="detail">
                      En savoir plus
                    </button>
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Aucune entreprise trouvée.</p>
          )}
        </div>
        <div className="voir-plus">
          <button>Voir plus</button>
        </div>
      </div>
    </section>
  );
};

export default EntrepriseList;
