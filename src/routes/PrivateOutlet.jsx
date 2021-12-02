import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';


function PrivateOutlet() {
   const { signed } = useContext(AuthContext);
   return signed ? <Outlet /> : <Navigate to="/" />;
  }
  
  export default PrivateOutlet;