import React from 'react'
import { CircleUserRound, ChartArea, LogOut, Trash2 } from 'lucide-react'
import '../css/Sidebar.css'

function Sidebar() {
    return (
        <>
            <aside className="sidebar">
                <div className='container'>
                    <CircleUserRound className='icon' size="4rem" />
                    
                    <h2>Usuario</h2>
                </div>

                <nav>
                    <ul>
                        <li> <a className="button" href="/Dashboard"> <ChartArea /> Dashboard</a></li>
                        <li> <a className="Cerrar-Sesion">  <Trash2 /> Parcelas Borradas</a></li>
                        <li> <a className="Cerrar-Sesion"> <LogOut /> Salir</a></li>
                    </ul>
                </nav>
            </aside>
        </>
    )
}

export default Sidebar