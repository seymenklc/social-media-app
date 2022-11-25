import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { UserAuthContextProvider } from './context/UserAuthContext';

ReactDOM.render(
  <BrowserRouter>
    <UserAuthContextProvider>
      <App />
    </UserAuthContextProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

