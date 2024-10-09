import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'

const LoginPage = () => {

    let {loginUser} = useContext(AuthContext)

  return (
    <div>
        <form onSubmit={loginUser}>
            <input type="text" name="mail" placeholder="Entrez mail" />
            <input type="password" name="password" placeholder="Entrez Mot de Passe" />
            <input type="submit" />
        </form>
    </div>
  )
}

export default LoginPage