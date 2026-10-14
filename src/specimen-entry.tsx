import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/index.css';
import { Specimen } from '@/Specimen';

createRoot(document.getElementById('root')!).render(<StrictMode><Specimen /></StrictMode>);
