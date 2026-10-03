import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { initPaperTexture } from './lib/paperTexture';
import './index.css';

// Initialize procedural handmade khadi paper & grain overlay tiles
initPaperTexture();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
