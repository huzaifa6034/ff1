
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Initializing FF Tourney Elite App...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Error: Could not find root element with id 'root'");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("App successfully mounted to DOM.");
  } catch (error) {
    console.error("Runtime error during app initialization:", error);
    rootElement.innerHTML = `
      <div style="color: white; padding: 20px; text-align: center; font-family: sans-serif;">
        <h1 style="color: #ff4c00;">App Initialization Failed</h1>
        <p>Something went wrong while starting the application.</p>
        <pre style="background: #111; padding: 10px; border-radius: 5px; text-align: left; overflow: auto;">${error}</pre>
      </div>
    `;
  }
}
