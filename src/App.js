import { BrowserRouter } from 'react-router-dom';
import Rotas from './routes';
import AuthProvider from './contexts/auth';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
          <ToastContainer autoClose={5000} />
          <Rotas />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
