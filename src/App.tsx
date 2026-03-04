import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './app/AppRouter';

const App: React.FC = () => (
  <BrowserRouter basename="/Neuroapp">
    <AppRouter />
  </BrowserRouter>
);

export default App;
