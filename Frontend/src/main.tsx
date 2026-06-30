
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
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