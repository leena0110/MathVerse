import React from 'react';
import './GameInstructions.css';

const GameInstructions = ({ instructions }) => (
  <div className="game-instructions">
    <h3>Instructions</h3>
    <ul>
      {instructions.map((inst, idx) => (
        <li key={idx}>{inst}</li>
      ))}
    </ul>
  </div>
);

export default GameInstructions;
