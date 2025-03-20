import React from 'react';
import '../css/Cards.css';

interface CardlluviaProps {
  lluvia: number;
}

function Cardlluvia({ lluvia }: CardlluviaProps) {
  return (
    <div className="card">
      <h2 className="card-title">Lluvia</h2>
      <p className="card-description">{lluvia} mm</p>
    </div>
  );
}

export default Cardlluvia;