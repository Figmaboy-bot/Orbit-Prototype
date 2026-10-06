import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { isNative } from './platform';
import './styles.css';

document.documentElement.classList.toggle('native', isNative);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
