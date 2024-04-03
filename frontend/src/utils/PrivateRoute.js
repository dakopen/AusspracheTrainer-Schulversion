import { Navigate } from 'react-router-dom';
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

// Assuming you have a function to check if the user is authenticated
// For example:
// const isAuthenticated = () => !!localStorage.getItem('authToken');
const isAuthenticated = () => {
  // Your authentication logic here
  return false; // Assume authenticated for demonstration
};
const PrivateRoute = ({ element: Element, ...rest }) => {
  let {user} = useContext(AuthContext)
 
  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/login" />;
};
export default PrivateRoute;