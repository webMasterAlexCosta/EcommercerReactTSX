import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Renderiza o componente principal 'App' no elemento com id 'root'
createRoot(document.getElementById('root')!).render(
  <App />
);
