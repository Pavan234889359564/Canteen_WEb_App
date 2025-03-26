import React from "react";
import ReactDOM from "react-dom/client"; // Import for React 18 rendering
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Get root element
const rootElement = document.getElementById("root");

// Create a React root and render
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);