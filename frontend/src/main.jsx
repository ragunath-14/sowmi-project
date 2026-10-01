import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext.jsx';
import './lib/sessionManager.js';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>
)
