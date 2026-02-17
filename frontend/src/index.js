import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer";

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("No se encontró el elemento root");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
      <BrowserRouter>
        <App />
        <Footer />
      </BrowserRouter>
  </React.StrictMode>
); 