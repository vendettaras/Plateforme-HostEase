import React, {useContext} from 'react'
import { Link } from "react-router-dom" ;
import AuthContext from '../context/AuthContext'

const LoginPage = () => {

    let {loginUser} = useContext(AuthContext)

  return (
    <div>
        <form onSubmit={loginUser}>
            <input type="text" name="email" placeholder="Entrez email" />
            <input type="password" name="password" placeholder="Entrez Mot de Passe" />
            <p>
              Vous n'avez pas de compte ? 
              <Link to="/inscription"> S'inscrire</Link>
            </p>
            <input type="submit" />
        </form>
    </div>
  )
}

export default LoginPage