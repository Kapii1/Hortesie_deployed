import React from "react";
import ReactDOM from "react-dom/client"; // Import from 'react-dom/client' in React 18
import "./index.css";
import App from "./App";
import {
  BrowserRouter as Router,
} from "react-router-dom";
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// Theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

// Core
import "primereact/resources/primereact.min.css";

// Icons
import "primeicons/primeicons.css";

import {  HelmetProvider } from 'react-helmet-async';

// Create a root for rendering the app
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <HelmetProvider>
      <ReactNotifications />
      <App />
    </HelmetProvider>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
