import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InscriptionUtilisateur = ({ onUserCreated }) => {
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      nom: nom,
      password: password
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register-user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Utilisateur créé avec succès", data);
        onUserCreated(data.id);  // Transmet l'ID de l'utilisateur pour la prochaine étape
        navigate('/');
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de la création de l'utilisateur:", errorData);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default InscriptionUtilisateur;
