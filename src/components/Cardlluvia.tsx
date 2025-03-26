import "../css/Cards.css"
import { CloudRain } from "lucide-react"

interface CardlluviaProps {
  lluvia: number
}

function Cardlluvia({ lluvia }: CardlluviaProps) {
  return (
    <div className="card rain">
      <h2 className="card-title">Lluvia</h2>
      <CloudRain size="2rem" />
      <p className="card-description">{lluvia} mm</p>
    </div>
  )
}

export default Cardlluvia

