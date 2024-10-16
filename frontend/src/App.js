import React from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import OffreList from './pages/OffreList';
import OffreCreate from './pages/OffreCreate';
import OffreEdit from './pages/OffreEdit';
import InscriptionFlow from './pages/InscriptionFlow';


function App() {
  return (
    
      <div className="App">
        <Router>
          <AuthProvider>
            <Header />
            <Routes>
              <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/offre-list" element={<OffreList />} />
              <Route path="/create-offre" element={<OffreCreate />} />
              <Route path="/offre/edit/:id" element={<OffreEdit />} />
              <Route path="/inscription" element={<InscriptionFlow />} />
            </Routes>
          </AuthProvider>
        </Router>
      </div>
  );
}

export default App;
