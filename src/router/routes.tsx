import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ParcelasDelete from '../pages/ParcelasDelete';

export const rutas = createBrowserRouter([

    {
        path: '/',
        element: <Dashboard />
    },
    {
        path: '/parcelasDelete',
        element: <ParcelasDelete />
    }
]);