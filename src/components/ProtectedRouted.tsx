import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem("token"); // Verifica si el token existe

    if (!token) {
        // Si no hay token, redirige al inicio de sesión
        return <Navigate to="/" replace />;
    }

    // Si hay token, renderiza el contenido protegido
    return <>{children}</>;
};

export default ProtectedRoute;