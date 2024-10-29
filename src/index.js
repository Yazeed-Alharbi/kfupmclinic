import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import "./index.css"
import { NextUIProvider } from '@nextui-org/react';

// Find the root element in your HTML file
const container = document.getElementById('root');
const root = createRoot(container);

// Use `createRoot` to render your app
root.render(
  <NextUIProvider>
    <App />
  </NextUIProvider>
);
