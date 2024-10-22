import React, { useContext } from 'react'
import { Link } from "react-router-dom";
import AuthContext from '../context/AuthContext'

import './css/offreList.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const LoginPage = () => {

  let { loginUser } = useContext(AuthContext)

  return (
    <div className="login">
      <form onSubmit={loginUser}>
        <div className="input-container">
          <i className="fas fa-envelope"></i>
          <input type="text" id="email" name="email" required placeholder=" " />
          <label for="email">Email</label>
        </div>

        <div className="input-container">
          <i className="fas fa-lock"></i>
          <input type="password" id="password" name="password" required placeholder=" " />
          <label for="password">Mot de passe</label>
        </div>

        <p className="para">
          Vous n'avez pas de compte ?
          <Link to="/inscription"> S'inscrire</Link>
        </p>
        <input type="submit" value="Connexion" className="connex" />
      </form>
    </div>
  )
}

export default LoginPage