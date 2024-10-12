import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom" ;
import AuthContext from '../context/AuthContext';

const OffreList = () => {
    const [offres, setOffres] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useContext(AuthContext);

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

    return (
        <div>
            <h1>Liste des Offres</h1>
            <ul>
                {offres.map((offre) => (
                    <li key={offre.id}>
                        <h2>{offre.nom_offre}</h2>
                        <p>Prix: {offre.prix} $</p>
                        <p>Description: {offre.description}</p>
                        {isAdmin && (
                            <>
                                <Link to={`/offre/edit/${offre.id}`}>
                                    Modifier
                                </Link>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OffreList;
