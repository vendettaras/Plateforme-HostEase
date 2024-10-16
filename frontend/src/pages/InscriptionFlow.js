import React, { useState } from 'react';
import InscriptionUtilisateur from './InscriptionUtilisateur';
import InscriptionEntreprise from './InscriptionEntreprise';

const InscriptionFlow = () => {
  const [userId, setUserId] = useState(null);

  const handleUserCreated = (id) => {
    setUserId(id);
  };

  return (
    <div>
      {!userId ? (
        <InscriptionUtilisateur onUserCreated={handleUserCreated} />
      ) : (
        <InscriptionEntreprise userId={userId} />
      )}
    </div>
  );
};

export default InscriptionFlow;
