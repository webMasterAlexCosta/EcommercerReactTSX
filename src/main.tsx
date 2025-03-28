import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Carregando } from './components/UI/Carregando';
import { TEXTO_PADRAO_SOLICITACAO } from './utils/system';

const LazyApp = React.lazy(() => import('./App'));

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<div><Carregando title={TEXTO_PADRAO_SOLICITACAO}/></div>}>
    <LazyApp />
  </Suspense>
);
