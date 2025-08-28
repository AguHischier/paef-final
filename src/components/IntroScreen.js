import React from "react";

export default function IntroScreen({ dni, setDni, start }) {
  return (
    <div className="app">
      <div className="card">
        <h1>Examen Teórico Gamificado</h1>
        <label>Ingresá tu DNI:</label>
        <input
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          placeholder="Ej: 12345678"
        />
        <p className="small">Elegí un modo:</p>
        <button className="btn" onClick={() => start("exam")}>
          Examen completo
        </button>
        <button className="btn-ghost" onClick={() => start("practiceTheory")}>
          Práctica teórica (sin tiempo)
        </button>
        <button className="btn-ghost" onClick={() => start("practiceSituations")}>
          Práctica situaciones (sin tiempo)
        </button>
        <button className="btn-ghost" onClick={() => start("challenge")}>
          Desafío rápido
        </button>
      </div>
    </div>
  );
}
