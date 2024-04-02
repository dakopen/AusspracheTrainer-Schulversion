import { Navigate } from 'react-router-dom';

// Assuming you have a function to check if the user is authenticated
// For example:
// const isAuthenticated = () => !!localStorage.getItem('authToken');
const isAuthenticated = () => {
  // Your authentication logic here
  return false; // Assume authenticated for demonstration
};
const PrivateRoute = ({ element: Element, ...rest }) => {
  //const { user } = useContext(AuthContext); // Assuming your AuthContext provides user state

  // Return either the element for the route or redirect to the login page
  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/login" />;
};
export default PrivateRoute;