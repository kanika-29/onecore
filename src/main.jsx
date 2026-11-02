import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Handle single-page app query path restoration safely without inline scripts
if (window.location.search && window.location.search[1] === '/') {
  const decoded = window.location.search
    .slice(1)
    .split('&')
    .map((s) => s.replace(/~and~/g, '&'))
    .join('?');
  window.history.replaceState(null, null, window.location.pathname.slice(0, -1) + decoded + window.location.hash);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
