import React, { useEffect, useState } from 'react';

const OffreList = () => {
    const [offres, setOffres] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffres = async () => {
            const response = await fetch('http://127.0.0.1:8000/api/offres/');
            const data = await response.json();
            setOffres(data);
            setLoading(false);
        };

        fetchOffres();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Liste des Offres</h1>
            <ul>
                {offres.map((offre) => (
                    <li key={offre.id}>
                        <h2>{offre.nom_offre}</h2>
                        <p>Prix: {offre.prix} $</p>
                        <p>Description: {offre.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OffreList;
