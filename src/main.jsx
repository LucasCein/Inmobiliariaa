import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { initFirebase } from './FireBase/config.js';
initFirebase()
ReactDOM.createRoot(document.getElementById('root')).render(
    <App />

)
