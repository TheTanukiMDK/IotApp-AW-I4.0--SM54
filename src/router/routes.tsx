import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Prueba from '../pages/Prueba';
import Graficos from '../pages/Graficos';
import ParcelasDelete from '../pages/ParcelasDelete'
import GraficosGeneral from '../pages/GraficosGenral';

export const rutas = createBrowserRouter([

    {
        path: '/',
        element: <Dashboard />
    },
    {
        path: '/parcelasDelete',
        element: <ParcelasDelete />
    },
    {
        path: '/graficos/:id_parcela',
        element: <Graficos />
    },
    {
        path: '/graficosGeneral',
        element: <GraficosGeneral />
    },
    {
        path: '/prueba',
        element: <Prueba />
    }
]);