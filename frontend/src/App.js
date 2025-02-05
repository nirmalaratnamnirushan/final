import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Footer, Navbar } from './components/layout';
//import Contact from './pages/Contact';
//import NotFound from './pages/NotFound';
import ProductList from './pages/admin/products/ProductList';
import CreateProduct from './pages/admin/products/CreateProduct';
import Register from './pages/Register';
import Login from './pages/Login';
import EditProduct from './pages/admin/products/EditProduct';
import AuthContextProvider, { AuthContext } from './context/AuthContext';


function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <InnerApp />
    </BrowserRouter>
  );
}

function InnerApp() {
  const location = useLocation(); // Access the current route's location

  // Define a function to check if the current path is either Register or Login
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';

  return (
    <>
      {/* Conditionally render Navbar and Footer based on the page */}
      {!isAuthPage && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/view" element={<ProductList />} />
        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/admin/products/create" element={<CreateProduct />} />
        <Route path="/admin/products/edit/:id" element={<EditProduct />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
