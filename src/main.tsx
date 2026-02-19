import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/app/styles/index.css';
import { ThemeProvider } from '@/shared/hooks';
import { App } from '@/App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
