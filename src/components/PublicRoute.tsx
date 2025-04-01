import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode;
}

const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem("token"); // Verifica si el token existe

    if (token) {
        // Si hay token, redirige al dashboard
        return <Navigate to="/dashboard" replace />;
    }

    // Si no hay token, renderiza el contenido público
    return <>{children}</>;
};

export default PublicRoute;