import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './src/router';
import "./index.css";
import { Analytics } from '@vercel/analytics/react';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Analytics />
    <Router />
  </React.StrictMode>
);
