import "../css/Cards.css"
import { CloudRainWind } from "lucide-react"

interface CardlluviaProps {
  lluvia: number
}

function Cardlluvia({ lluvia }: CardlluviaProps) {
  return (
    <div className="card rain">
      <h2 className="card-title">Lluvia</h2>
      <CloudRainWind size="3rem" />
      
      <p className="card-description">{lluvia} mm</p>
    </div>
  )
}

export default Cardlluvia

