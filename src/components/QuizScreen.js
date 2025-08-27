import React from "react";

export default function QuizScreen({
  question,
  index,
  total,
  answers,
  selectOption,
  secondsLeft,
  mode,
  RISK_META,
}) {
  const ans = answers[question.id];
  const riskColor =
    question.risk === "red"
      ? "var(--danger)"
      : question.risk === "yellow"
      ? "#f59e0b"
      : "var(--success)";

  return (
    <div className="app">
      <div className="card" style={{ borderLeft: `6px solid ${riskColor}` }}>
        <div className="header">
          <div className="row">
            <h2 style={{ margin: 0 }}>
              Pregunta {index + 1} / {total}
            </h2>
            <span className={`pill risk-${question.risk}`}>
              {RISK_META[question.risk].label}
            </span>
            <span className="badge">Valor: {RISK_META[question.risk].points} pts</span>
          </div>
          {secondsLeft !== null && (
            <div className="badge">⏱ {secondsLeft}s</div>
          )}
        </div>

        <p style={{ marginTop: 8 }}>{question.prompt}</p>

        {question.image && (
          <img
            src={question.image}
            alt="pregunta"
            style={{ maxWidth: "80%", margin: "12px auto", display: "block" }}
          />
        )}

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {question.options.map((o) => {
            const selected = ans?.optionId === o.id;
            return (
              <label
                key={o.id}
                style={{
                  display: "block",
                  border: `1px solid ${selected ? "var(--primary)" : "#e6eef7"}`,
                  background: selected ? "rgba(2,132,199,0.06)" : "#fff",
                  padding: 12,
                  borderRadius: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name={question.id}
                  checked={selected}
                  onChange={() => selectOption(question.id, o.id)}
                  style={{ marginRight: 8 }}
                />
                {o.text}
              </label>
            );
          })}
        </div>

        {mode && (
          <div className="footer">Modo: {mode === "exam" ? "Examen" : mode === "practice" ? "Práctica" : "Desafío"}</div>
        )}
      </div>
    </div>
  );
}
