import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'

const LoginPage = () => {
  let {loginUser} = useContext(AuthContext)
  return (
    <div>
        <form onSubmit={loginUser}>
            <input type="text" name="username" placeholder="Benutzernamen eingeben"/>
            <input type="password" name="password" placeholder="Passwort eingeben"/>
            <input type="submit"/>
        </form>
    </div>
  )
}

export default LoginPage
