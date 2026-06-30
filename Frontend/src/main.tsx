// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Layout } from './Components/LayoutArea/Layout/Layout'
import './index.css'
import { AuthProvider } from './Context/AuthContext'
import { Routing } from './Components/LayoutArea/Routing/Routing'

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <BrowserRouter>
            <Routing />
        </BrowserRouter>
    </AuthProvider>
)