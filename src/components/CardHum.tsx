import React from 'react';
import '../css/Cards.css';

interface CardHumProps {
  humedad: number;
}

function CardHum({ humedad }: CardHumProps) {
  return (
    <div className="card">
      <h2 className="card-title">Humedad</h2>
      <p className="card-description">{humedad} %</p>
    </div>
  );
}

export default CardHum;