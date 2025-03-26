import "../css/Cards.css"
import { Sun } from "lucide-react"

interface CardSolProps {
  sol: number
}

function CardSol({ sol }: CardSolProps) {
  return (
    <div className="card sun">
      <h2 className="card-title">Sol</h2>
      <Sun size="2rem" />
      <p className="card-description">{sol} %</p>
    </div>
  )
}

export default CardSol

