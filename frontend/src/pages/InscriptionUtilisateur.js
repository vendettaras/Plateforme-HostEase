import React, { useState } from 'react';

const InscriptionUtilisateur = ({ onUserCreated }) => {
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('nom', nom);
    formData.append('password', password);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register-user/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Utilisateur créé avec succès", data);
        onUserCreated(data.id);
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
      <input
        type="file"
        onChange={(e) => setPhoto(e.target.files[0])}
      />
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default InscriptionUtilisateur;
