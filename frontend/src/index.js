import React from 'react';
import ReactDOM from 'react-dom/client';
import { Footer, Navbar } from './components/layout';
import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom';
import ProductList from './pages/admin/products/ProductList';
import CreateProduct from './pages/admin/products/CreateProduct';
import Register from './pages/Register'
import Login from './pages/Login';
import AuthContextProvider, { AuthContext } from './context/AuthContext';
import { useContext } from "react";
import App from './App';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
    <App/>
    </AuthContextProvider>
  </React.StrictMode>
);

