import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import './css/offreList.css';
import image from './image/undraw_happy_news_re_tsbd.svg'

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const OffreList = () => {
    const navigate = useNavigate();
    const [offres, setOffres] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffres = async () => {
            const response = await fetch('http://127.0.0.1:8000/api/offres/');
            const data = await response.json();
            // console.log(data);
            setOffres(data);
            setLoading(false);
        };

        fetchOffres();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleViewDetails = (id) => {
        navigate(`/offre/${id}`);  // Redirige vers la page de détail d'une entreprise
    };

    return (
        <div>
            <section className="list-offre">
                <h3 className="nos-offres">
                    <span className="text-blanc">Nos </span>
                    <span className="text-bleu">Offres</span>
                </h3>
                <div className="container text-center">
                    <div className="row justify-content-center">
                        <div className="col-4">
                            <div className="carte1">
                                <p className="intro">
                                    <span>Économisez plus avec des </span>
                                    <span className="bold-texte"> plans adaptés</span>
                                </p>
                                <p className="texte-centre">
                                    Choisissez un plan et profitez d'une offre avantageuse
                                </p>
                                <img src={image} className="image" alt="illustration" />
                            </div>
                        </div>
                        {offres.map((offre) => (
                            <div className="col-4" key={offre.id}>
                                <div className="carte2">
                                    <p className="description">
                                        <span className="descri">
                                            <i className="fas fa-tags"></i>
                                        </span>
                                        <span className="bold-texte"> {offre.nom_offre} </span>
                                    </p>
                                    <p className="vousAurez">
                                        Vous aurez
                                    </p>
                                    <p>
                                        <span className="description-offre">
                                            <i className="fas fa-check-circle"></i>
                                        </span>
                                        <span className="">{offre.description}</span>
                                    </p>
                                    <p>
                                        <span className="description-offre">
                                            <i className="fas fa-check-circle"></i>
                                        </span>
                                        <span className="">{offre.description}</span>
                                    </p>
                                    <p>
                                        <span className="description-offre">
                                            <i className="fas fa-check-circle"></i>
                                        </span>
                                        <span className="">{offre.description}</span>
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
                                    <p className="en-savoir">
                                        <button onClick={() => handleViewDetails(offre.id)}>
                                            En savoir plus
                                        </button>
                                    </p>
                                </div>
                            </div>
                        ))};
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OffreList;
