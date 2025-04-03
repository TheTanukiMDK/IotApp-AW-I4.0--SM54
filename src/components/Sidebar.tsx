import React, { useEffect, useState } from "react";
import "../css/Sidebar.css";
import { useNavigate } from "react-router-dom";
import {
    BarChart2,
    Trash2,
    Folder,
    Users,
    ArrowUpRight,
    Flag,
    Bell,
    User,
    Settings,
    LogOut,
    LayoutDashboard
} from "lucide-react";

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    useEffect(() => {
        // Obtener el nombre del usuario desde localStorage
        const storedUsername = localStorage.getItem("username");
        const storedProfilePicture = localStorage.getItem("profilePicture"); // Si tienes la imagen guardada
        if (storedUsername) {
            setUsername(storedUsername);
        }
        if (storedProfilePicture) {
            setProfilePicture(storedProfilePicture);
        }
    }, []);

    const handleLogout = () => {
        // Eliminar el token de autenticación
        localStorage.removeItem("token");
        localStorage.removeItem("username"); // Eliminar el nombre del usuario
       // localStorage.removeItem("profilePicture"); // Eliminar la foto
        // Redirigir al usuario a la página de inicio de sesión
        navigate("/");
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h1>🌱</h1>
                <h2>SmartCrop</h2>
            </div>
            <ul className="sidebar-links">
                <h4>
                    <span>Menu Principal</span>
                    <div className="menu-separator"></div>
                </h4>
                <li>
                    <a href="/">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </a>
                </li>
                <h4>
                    <span>General</span>
                    <div className="menu-separator"></div>
                </h4>
                <li>
                    <a href="/parcelasDelete">
                        <Trash2 size={20} />
                        Parcelas<br></br> Eliminadas
                    </a>
                </li>
                <h4>
                    <span>Account</span>
                    <div className="menu-separator"></div>
                </h4>
                <li>
                    <a href="/perfilUser">
                        <User size={20} />
                        Perfil
                    </a>
                </li>
                <li>
                    <a onClick={handleLogout} href="#">
                        <LogOut size={20} />
                        Cerrar Sesion
                    </a>
                </li>
            </ul>
            <div className="user-account">
            <div className="user-profile">
                   {/*  <img
                        src={profilePicture || "../assets/img/profile.jpg"} // Mostrar la foto de perfil o una predeterminada
                        alt="Foto de perfil"
                        className="profile-image"
                    /> */}
                    <div className="user-detail">
                        <h3>{username || "Nombre"}</h3> {/* Mostrar el nombre del usuario */}
                        <span>Admin</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;