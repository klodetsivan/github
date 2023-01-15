import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Components/LayoutArea/Layout/Layout';
import reportWebVitals from './reportWebVitals';

import interceptorsService from './Services/InterceptorsService';
import './index.css';
import VacationsReports from './Components/VacationsArea/VacationsReports/VacationsReports';

// create all interceptors once: 
interceptorsService.createInterceptors();

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    // <React.StrictMode>
        <BrowserRouter>
         <Layout/>
        </BrowserRouter>
    /* </React.StrictMode> */
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
