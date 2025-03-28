import { LayoutDashboard, LogOut, Trash2, ChartNoAxesCombined } from "lucide-react"
import "../css/Sidebar.css"

function Sidebar() {
  return (
    <>
      <aside className="sidebar">
        <div className="container">
          <h1>App de Iot</h1>
        </div>

        <nav>
          <ul>
            <li>
              {" "}
              <a className="button" href="/">
                {" "}
                <LayoutDashboard /> Dashboard Inicial
              </a>
            </li>
           <li>
              {" "}
              <a className="Cerrar-Sesion" href="/graficosGeneral">
                {" "}
                <ChartNoAxesCombined /> Graficas
              </a>
            </li>
            <li>
              {" "}
              <a className="Cerrar-Sesion" href="/parcelasDelete">
                {" "}
                <Trash2 /> Parcela Trash
              </a>
            </li>
            <li>
              {" "}
              <a className="Cerrar-Sesion">
                {" "}
                <LogOut /> Salir
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar

