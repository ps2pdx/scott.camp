import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/base.css';

function Placeholder() {
  return <main>bell</main>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><Placeholder /></StrictMode>);
