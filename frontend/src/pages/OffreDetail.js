import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const OffreDetail = () => {
    const { id } = useParams(); // Récupère l'ID depuis l'URL
    const navigate = useNavigate();
    const { isAdmin } = useContext(AuthContext); // Récupère les tokens d'authentification et l'utilisateur
    const [offre, setOffre] = useState(null);

    useEffect(() => {
        const fetchOffre = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/offre/${id}/`);
                if (response.ok) {
                    const data = await response.json();
                    setOffre(data);
                } else {
                    console.error('Erreur lors de la récupération de l\'offre');
                }
            } catch (error) {
                console.error('Erreur réseau', error);
            }
        };

        fetchOffre();
    }, [id]);

    const handleEdit = () => {
        navigate(`/offre/${id}/modifier/`);
    };

    if (!offre) return <div>Chargement...</div>;

    return (
        <div className="carte2">
            {isAdmin && (
                <Link to="/create-offre">
                    <button>Ajouter une offre</button>
                </Link>
            )}
            <p className="description">
                <span className="descri">
                    <i className="fas fa-tags"></i>
                </span>
                <span className="bold-texte"> {offre.nom_offre} </span>
            </p>
            <p>
                <span className="description-offre">
                    <i className="fas fa-check-circle"></i>
                </span>
                <span className="">{offre.description}</span>
            </p>
            <hr class="custom-line" />
            <p className="offre">
                <span className="prix-offre">{offre.prix} $</span>
                <span className="mois"> /mois</span>
            </p>
            <p>
                {isAdmin && (
                    <>
                        <button onClick={handleEdit}>Modifier</button>
                    </>
                )}
            </p>
        </div>
    );
};

export default OffreDetail;
