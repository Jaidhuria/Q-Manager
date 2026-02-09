import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import useThemeStore from './store/useThemeStore';

// Apply saved theme before first paint
useThemeStore.getState().initTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
