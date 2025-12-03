import React from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, NavLink, Route, Routes, Navigate} from 'react-router-dom'
import ProductsPage from './pages/ProductsPage.jsx'
import PersonsPage from './pages/PersonsPage.jsx'
import OrgsPage from './pages/OrgsPage.jsx'
import './reset.css'
import ImportHistoryPage from './pages/ImportHistoryPage.jsx';

function App() {
    return (
        <div className="app">
            <aside className="side">
                <div className="brand">Учет продуктов</div>
                <div className="nav">
                    <NavLink to="/products">Продукты</NavLink>
                    <NavLink to="/persons">Люди</NavLink>
                    <NavLink to="/orgs">Организации</NavLink>
                    <NavLink to="/imports">История импорта</NavLink>
                </div>
            </aside>
            <main className="content">
                <Routes>
                    <Route path="/" element={<Navigate to="/products" replace/>}/>
                    <Route path="/products" element={<ProductsPage/>}/>
                    <Route path="/persons" element={<PersonsPage/>}/>
                    <Route path="/orgs" element={<OrgsPage/>}/>
                    <Route path="/imports" element={<ImportHistoryPage/>}/>
                </Routes>
            </main>
        </div>
    )
}

createRoot(document.getElementById('root')).render(
    <BrowserRouter><App/></BrowserRouter>
)
