import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// this is the entry point of the React app
// it mounts the App component into the #root div in index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
