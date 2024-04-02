import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'


const Header = () => {
  let {name} = useContext(AuthContext)
  return (
    <div>
      <Link to="/">Home</Link>
      <span> | </span>
      <Link to="/login">Login</Link>
      
      <p>Hello { name }</p>
    </div>
  )
}

export default Header
