import React from 'react';
import './css/styles.css';
import accueil from './image/undraw_visionary_technology_re_jfp7.svg';
import logo1 from './image/HostEase_blanc.gif';
import tuto from './image/undraw_tutorial_video_re_wepc.svg';
import OffreList from './OffreList';
import EntrepriseList from './EntrepriseList';

import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  return (

    <>
      <section className="accueil">
        <div className="container">
          <div className="row">
            <div className="col-6">
              <img src={logo1} className="logo1" alt="Logo de l'entreprise" />
              <p className="bienvenue">
                Bienvenue sur HostEase ! Gérez facilement votre activité
                sans complexité. Entrez vos informations et laissez-nous
                nous occuper du reste. HostEase est là pour simplifier votre
                expérience et vous permettre de vous concentrer sur vos clients.
              </p>
              <button className="suite">
                Lire la suite
              </button>
            </div>
            <div className="col-6">
              <img src={accueil} className="custom-image" alt="accueil" />
            </div>
          </div>
        </div>
      </section>
      <section className="pourquoi">
        <p class="pourquoi-hostease">
          <span class="text-wrapper">Pourquoi</span>
          <span class="span">&nbsp;</span>
          <span class="text-wrapper-2">HostEase ?</span>
        </p>
        <div className="container">
          <div className="row">
            <div className="col-6">
              <div className="overlap">
                <p className="hostease-se">
                  HostEase se distingue par sa simplicité et son adaptation aux besoins spécifiques des entreprises.
                  Contrairement aux solutions complexes, HostEase propose une interface facile à utiliser où les entreprises
                  n’ont qu’à entrer leurs informations pour gérer leurs produits ou services. Aucun besoin de compétences
                  techniques : tout est automatisé pour que vous puissiez vous concentrer sur vos activités.<br />Avec une
                  sécurité renforcée, une scalabilité qui suit la croissance de votre entreprise, et un support client
                  disponible 24/7, HostEase est la solution idéale pour les entreprises recherchant une gestion efficace et
                  sans tracas de leur infrastructure serveur.
                </p>
                <div className="row">
                  <div className="col-2" >
                    <div class="rectangle">
                      <span class="text-wrapper-3">+4M</span>
                      <span class="text-wrapper-4">Données</span>
                    </div>
                  </div>
                  <div className="col-2" >
                    <div class="rectangle-2">
                      <div class="text-wrapper-3">+2K</div>
                      <div class="text-wrapper-4">Entreprises</div>
                    </div>
                  </div>
                  <div className="col-2" >
                    <div class="rectangle-3">
                      <div class="text-wrapper-3">+10K</div>
                      <div class="text-wrapper-4">Clients</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <img
                className="undraw-tutorial"
                src={tuto}
                alt="illustration"
              />
            </div>
          </div>
        </div>
      </section>
      <OffreList />
      <EntrepriseList />
    </>
  )
}

export default HomePage