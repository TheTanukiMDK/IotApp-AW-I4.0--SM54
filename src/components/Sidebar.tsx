import React from "react";
import "../css/Sidebar.css";
import profile from "../assets/profile.png";
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

const handleLogout = () => {
    // Eliminar el token de autenticación
    localStorage.removeItem("token");
    // Redirigir al usuario a la página de inicio de sesión
    navigate("/");
};

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>🌱
        </h1>
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
            Parcelas<br></br> Borradas
          </a>
        </li>
        {/*<li>
          <a href="#">
            <Users size={20} />
            Groups
          </a>
        </li>
        <li>
          <a href="#">
            <ArrowUpRight size={20} />
            Transfer
          </a>
        </li>
        <li>
          <a href="#">
            <Flag size={20} />
            All Reports
          </a>
        </li>
        <li>
          <a href="#">
            <Bell size={20} />
            Notifications
          </a>
        </li>*/}
        <h4>
          <span>Account</span>
          <div className="menu-separator"></div>
        </h4>
        <li>
          <a href="#">
            <User size={20} />
            Perfil
          </a>
        </li>
        <li>
          <a href="#">
            <Settings size={20} />
            Configuracion
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
          <img src={profile} alt="Profile" />
          <div className="user-detail">
            <h3>Adia</h3>
            <span>Desinger UX/UI</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;