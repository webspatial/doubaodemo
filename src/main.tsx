import React from 'react';
import ReactDOM from 'react-dom/client';
import { SpatialBoot } from '@webspatial/react-sdk';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SpatialBoot
      onError={(err) => console.error('[doubaodemo] bootSpatial failed', err)}
    >
      <App />
    </SpatialBoot>
  </React.StrictMode>,
);
