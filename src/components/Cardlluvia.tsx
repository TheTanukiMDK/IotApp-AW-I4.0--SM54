import "../css/Cards.css"
import { CloudRain } from "lucide-react"

interface CardlluviaProps {
  lluvia: number
}

function Cardlluvia({ lluvia }: CardlluviaProps) {
  return (
    <div className="card rain">
      <h2 className="card-title">Tarjeta Lluvia</h2>
      <CloudRain size="1rem" />
      <p className="card-description">{lluvia} mm</p>
    </div>
  )
}

export default Cardlluvia

