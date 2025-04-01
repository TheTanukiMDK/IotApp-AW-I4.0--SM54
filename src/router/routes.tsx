import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Prueba from '../pages/Prueba';
import Graficos from '../pages/Graficos';
import ParcelasDelete from '../pages/ParcelasDelete'
import GraficosGeneral from '../pages/GraficosGenral';
import Login from '../pages/Login';
import Registro from '../pages/Registro';
import ProtectedRoute from '../components/ProtectedRouted';
import PublicRoute from '../components/PublicRoute';

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
        path: '/graficosGeneral',
        element:
            <ProtectedRoute>
                <GraficosGeneral />
            </ProtectedRoute>
    },
]);