import React from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import OffreList from './pages/OffreList';
import OffreCreate from './pages/OffreCreate';
import OffreEdit from './pages/OffreEdit';
import InscriptionFlow from './pages/InscriptionFlow';
import InfoEntrepriseEdit from './pages/InfoEntrepriseEdit';
import EntrepriseList from './pages/EntrepriseList';
import EntrepriseDetail from './pages/EntrepriseDetail';
import OffreDetail from './pages/OffreDetail';


function App() {
  return (
    
      <div className="App">
        <Router>
          <AuthProvider>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/offre-list" element={<OffreList />} />
              <Route path="/create-offre" element={<OffreCreate />} />
              <Route path="/offre/:id/modifier/" element={<OffreEdit />} />
              <Route path="/inscription" element={<InscriptionFlow />} />
              <Route path="/entreprise/:id/modifier" element={<InfoEntrepriseEdit />} />
              <Route path="/entreprise-list" element={<EntrepriseList />} />
              <Route path="/entreprise/:id" element={<EntrepriseDetail />} />
              <Route path="/offre/:id" element={<OffreDetail />} />
            </Routes>
          </AuthProvider>
        </Router>
      </div>
  );
}

export default App;
