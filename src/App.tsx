import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './app/AppRouter';
import { ToastProvider } from './app/ToastContext';

const App: React.FC = () => (
  <BrowserRouter basename="/Neuroapp">
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  </BrowserRouter>
);

export default App;
