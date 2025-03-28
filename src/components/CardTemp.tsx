import "../css/Cards.css"
import { ThermometerSun } from "lucide-react"

interface CardTempProps {
  temperatura: number
}

function CardTemp({ temperatura }: CardTempProps) {
  return (
    <div className="card temperature">
      <h2 className="card-title"> Tarjeta Temperatura</h2>
      <ThermometerSun size="1rem" />
      <p className="card-description">{temperatura} °C</p>
    </div>
  )
}

export default CardTemp

