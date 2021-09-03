import React from 'react';
import './App.scss';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css'
import { BrowserRouter as Router } from "react-router-dom";
import { SnackbarProvider } from 'notistack';
import Rotas from './app/core/routes';
import AuthProvider from './app/hooks/auth/AuthProvider';
import LoadingProvider from './app/hooks/loading/LoadingProvider';

function App() {
  return (
    <LoadingProvider>
      <SnackbarProvider maxSnack={3}>
        <Router>
          <AuthProvider>
            <Rotas />
          </AuthProvider>
        </Router>
      </SnackbarProvider>
    </LoadingProvider>
  );
}

export default App;
