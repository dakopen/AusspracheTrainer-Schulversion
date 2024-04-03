import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'


const Header = () => {
  let {user, logoutUser} = useContext(AuthContext)
  return (
    <div>
      <Link to="/">Home</Link><br></br>
      <Link to="/create-teacher">Create Teacher</Link>
      <span> | </span>
      {user ? <p onClick={logoutUser}>Logout</p> : <Link to="/login">Login</Link>}
      {user && <p>Hello user with Role: { user.role }</p>}
      <hr></hr>
      
    </div>
  )
}

export default Header
