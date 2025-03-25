import "../css/Cards.css"

interface CardTempProps {
  temperatura: number
}

function CardTemp({ temperatura }: CardTempProps) {
  return (
    <div className="card temperature">
      <h2 className="card-title">Temperatura</h2>
      <p className="card-description">{temperatura} °C</p>
    </div>
  )
}

export default CardTemp

