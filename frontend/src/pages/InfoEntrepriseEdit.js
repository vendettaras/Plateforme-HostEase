import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const InfoEntrepriseEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authTokens, user } = useContext(AuthContext);

    const [entreprise, setEntreprise] = useState({
        nom_entreprise: '',
        nif: '',
        stat: '',
        mail: '',
        contact: '',
        localisation: '',
        proprio: '',
        logo: '',
    });

    const [logoMessage, setLogoMessage] = useState('');

    useEffect(() => {
        const fetchEntreprise = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/entreprise/${id}/modifier/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens?.access}`
                    },
                });

                if (response.ok) {
                    let data = await response.json();
                    setEntreprise(data);
                } else {
                    console.error('Erreur lors de la récupération de l\'entreprise');
                }
            } catch (error) {
                console.error('Erreur réseau', error);
            }
        };

        if (id) {
            fetchEntreprise();
        }
    }, [id, authTokens]);

    const handleSubmitInfo = async (e) => {
        e.preventDefault();

        const updatedData = {
            nom_entreprise: entreprise.nom_entreprise,
            nif: entreprise.nif,
            stat: entreprise.stat,
            mail: entreprise.mail,
            contact: entreprise.contact,
            localisation: entreprise.localisation,
            proprio: entreprise.proprio,
        };

        try {
            let response = await fetch(`http://127.0.0.1:8000/api/entreprise/${id}/modifier/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authTokens?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                navigate(`/entreprise/${id}`); // Redirige vers la liste des entreprises
            } else {
                const data = await response.json();
                console.error('Error:', data);
                alert(data.detail || 'Une erreur est survenue lors de la mise à jour des informations.');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'entreprise', error);
        }
    };

    const handleSubmitLogo = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('logo', e.target.logo.files[0]);

        try {
            let response = await fetch(`http://127.0.0.1:8000/api/entreprise/${id}/modifier/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authTokens?.access}`,
                },
                body: formData,
            });

            if (response.ok) {
                setLogoMessage('Logo mis à jour avec succès.'); // Affiche un message de succès
                window.location.reload();
            } else {
                const data = await response.json();
                console.error('Error:', data);
                alert(data.detail || 'Une erreur est survenue lors de la mise à jour du logo.');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du logo', error);
        }
    };

    const handleChange = (e) => {
        setEntreprise({
            ...entreprise,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            <h1>Modifier les informations de l'entreprise</h1>
            {user?.id === entreprise.user ? (
                <form onSubmit={handleSubmitInfo}>
                    <label>
                        Nom de l'entreprise:
                        <input type="text" name="nom_entreprise" value={entreprise.nom_entreprise} onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        NIF:
                        <input type="text" name="nif" value={entreprise.nif} onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        Stat:
                        <input type="text" name="stat" value={entreprise.stat} onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        Email:
                        <input type="email" name="mail" value={entreprise.mail} onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        Contact:
                        <input type="text" name="contact" value={entreprise.contact} onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        Localisation:
                        <input type="text" name="localisation" value={entreprise.localisation} onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        Propriétaire:
                        <input type="text" name="proprio" value={entreprise.proprio} onChange={handleChange} />
                    </label>
                    <br />
                    <button type="submit">Modifier les informations</button>
                </form>
            ) : (
                <p>Vous n'avez pas les droits pour modifier ces informations.</p>
            )}

            <h1>Modifier le logo de l'entreprise</h1>
            <form onSubmit={handleSubmitLogo}>
                <label>
                    Logo:
                    <img src={entreprise.logo} alt="Logo de l'entreprise" style={{ width: '100px', height: 'auto' }} />
                    <input type="file" name="logo" accept="image/*" />
                </label>
                <br />
                <button type="submit">Modifier le logo</button>
            </form>
            {logoMessage && <p>{logoMessage}</p>} {/* Affiche le message de succès */}
        </div>
    );
};

export default InfoEntrepriseEdit;
