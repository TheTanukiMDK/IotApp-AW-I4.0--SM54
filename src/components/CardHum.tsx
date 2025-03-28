import "../css/Cards.css"
import { Droplets } from "lucide-react"
interface CardHumProps {
  humedad: number
}

function CardHum({ humedad }: CardHumProps) {
  return (
    <div className="card humidity">
      <h2 className="card-title">Tarjeta Humedad </h2>
      <Droplets size="1rem" />
      <p className="card-description">{humedad} %</p>
    </div>
  )
}

export default CardHum

