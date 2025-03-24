import React from 'react'
import { CircleUserRound, ChartArea, LogOut, Trash2 } from 'lucide-react'
import '../css/Sidebar.css'

function Sidebar() {
    return (
        <>
            <aside className="sidebar">
                <div className='container'>
                    <h1>IotApp</h1>
                </div>

                <nav>
                    <ul>
                        <li> <a className="button" href="/"> <ChartArea /> Dashboard</a></li>
                        <li> <a className="Cerrar-Sesion" href='/parcelasDelete'>  <Trash2 /> Parcelas Borradas</a></li>
                        <li> <a className="Cerrar-Sesion"> <LogOut /> Salir</a></li>
                    </ul>
                </nav>
            </aside>
        </>
    )
}

export default Sidebar