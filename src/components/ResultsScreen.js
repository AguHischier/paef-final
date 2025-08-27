import React from "react";

export default function ResultsScreen({ questions, answers, restart, RISK_META }) {
  let score = 0,
    maxScore = 0,
    correct = 0;
  for (const q of questions) {
    maxScore += RISK_META[q.risk].points;
    if (answers[q.id]?.correct) {
      score += RISK_META[q.risk].points;
      correct++;
    }
  }
  const pct = Math.round((score / maxScore) * 100);
  const approved = pct >= 70;

  return (
    <div className="app">
      <div className="card">
        <h1>{approved ? "✔ Aprobado" : "✖ Desaprobado"}</h1>
        <p>
          Puntaje: {score}/{maxScore} ({pct}%)
        </p>
        <p>
          Correctas: {correct}/{questions.length}
        </p>
        {approved && <div className="badge">🏅 Medalla de Seguridad Vial</div>}

        <button className="btn" onClick={restart} style={{ marginTop: 20 }}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
