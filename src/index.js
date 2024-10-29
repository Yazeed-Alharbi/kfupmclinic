// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import "./index.css";
import { NextUIProvider } from '@nextui-org/react';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <NextUIProvider>
      <App />
    </NextUIProvider>
);
