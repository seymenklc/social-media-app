import { Routes, Route, Navigate } from 'react-router-dom';
// hooks
import { useAuthContext } from './hooks/useAuthContext';
// pages 
import PostDetails from './pages/PostDetails';
import Dashboard from './pages/Dashboard';
//  components
import AuthForm from './components/AuthForm';
import Navbar from './components/Navbar';

export default function App() {
  const { isAuthReady, user } = useAuthContext();

  return (
    <div className='h-full'>
      {isAuthReady && (
        <>
          <Navbar />
          <Routes>
            <Route
              path='/'
              element={<Dashboard />}
            />
            <Route
              path='/login'
              element={!user ? <AuthForm /> : <Navigate to='/' />}
            />
            <Route
              path='/signup'
              element={!user ? <AuthForm /> : <Navigate to='/' />}
            />
            <Route
              path='/post/:id'
              element={<PostDetails />}
            />
          </Routes>
        </>
      )}
    </div>
  );
};