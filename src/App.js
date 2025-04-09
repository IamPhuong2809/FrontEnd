import './App.css';
import AppRoutes from './routes/index';
import { Toaster } from 'react-hot-toast';

function App() {   
  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;
