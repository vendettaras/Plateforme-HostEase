import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AuthContext from '../context/AuthContext';

const InscriptionEntreprise = ({ userId }) => {
  const [nomEntreprise, setNomEntreprise] = useState('');
  const [nif, setNif] = useState('');
  const [stat, setStat] = useState('');
  const [contact, setContact] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [proprio, setProprio] = useState('');
  const [logo, setLogo] = useState(null);

  const navigate = useNavigate();
  const { setAuthTokens, setUser } = useContext(AuthContext);  // Assurez-vous que ces valeurs sont bien obtenues

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nom_entreprise", nomEntreprise);
    formData.append("nif", nif);
    formData.append("stat", stat);
    formData.append("contact", contact);
    formData.append("localisation", localisation);
    formData.append("proprio", proprio);
    formData.append("logo", logo);
    formData.append("user_id", userId);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register-entreprise/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Erreur lors de la création de l'entreprise:", data);
      } else {
        const data = await response.json();
        const authToken = data.authToken;  // Assurez-vous que le backend renvoie le token

        // Mettre à jour le contexte avec les nouveaux tokens
        setAuthTokens({ access: authToken });
        setUser(jwtDecode(authToken));  // Mettre à jour l'utilisateur avec le token

        // Sauvegarder les tokens dans localStorage
        localStorage.setItem('authTokens', JSON.stringify({ access: authToken }));

        // Rediriger vers la page d'accueil
        console.log("Entreprise créée avec succès, redirection...");
        navigate('/');
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nom de l'entreprise"
        value={nomEntreprise}
        onChange={(e) => setNomEntreprise(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="NIF"
        value={nif}
        onChange={(e) => setNif(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="STAT"
        value={stat}
        onChange={(e) => setStat(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Contact"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Localisation"
        value={localisation}
        onChange={(e) => setLocalisation(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Propriétaire"
        value={proprio}
        onChange={(e) => setProprio(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={(e) => setLogo(e.target.files[0])}
      />
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default InscriptionEntreprise;
