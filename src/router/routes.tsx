import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Graficos from '../pages/Graficos';
import ParcelasDelete from '../pages/ParcelasDelete'
import Login from '../pages/Login';
import Registro from '../pages/Registro';
import PerfilUser from '../pages/PerfilUser';
import ProtectedRoute from '../components/ProtectedRouted';
import PublicRoute from '../components/PublicRoute';
import NotFound from '../error/NotFound';

export const rutas = createBrowserRouter([
    {
        path: '/',
        element:
            <PublicRoute>
                <Login />
            </PublicRoute>
    },
    {
        path: '/registro',
        element:
            <PublicRoute>
                <Registro />
            </PublicRoute>
    },
    {
        path: '/dashboard',
        element:
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
    },
    {
        path: '/parcelasDelete',
        element:
            <ProtectedRoute>
                <ParcelasDelete />
            </ProtectedRoute>
    },
    {
        path: '/graficos/:id_parcela',
        element:
            <ProtectedRoute>
                <Graficos />
            </ProtectedRoute>
    },
    {
        path: '/perfilUser',
        element:
            <ProtectedRoute>
               <PerfilUser />
            </ProtectedRoute>
    },
    {
        path: '*', // Ruta para manejar páginas no existentes
        element: <NotFound />,
    }
]);