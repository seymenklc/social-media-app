import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// hooks
import { useAuthContext } from './hooks/useAuthContext';
// pages & components
import PostDetails from './pages/PostDetails';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';

function App() {
  const { isAuthReady, user } = useAuthContext();

  return (
    <div>
      {isAuthReady && (
        <React.Fragment>
          <Navbar />
          <Routes>
            <Route
              path='/'
              element={user ? <Dashboard /> : <Navigate to='/login' />}
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
              element={user ? <PostDetails /> : <Navigate to='/login' />}
            />
          </Routes>
        </React.Fragment>
      )}
    </div>
  );
};

export default App;