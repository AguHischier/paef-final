import React, { useEffect, useMemo, useState } from "react";

export default function IntroScreen({ dni, setDni, start, weakCount = 0, examDate = "", setExamDate }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000 * 60); // actualizar cada minuto
    return () => clearInterval(t);
  }, []);

  function readPerf() {
    try {
      const raw = localStorage.getItem("perfStats");
      const data = raw ? JSON.parse(raw) : null;
      return data || { byRisk: { red: { answered: 0, correct: 0 }, yellow: { answered: 0, correct: 0 }, green: { answered: 0, correct: 0 } }, total: { answered: 0, correct: 0 } };
    } catch {
      return { byRisk: { red: { answered: 0, correct: 0 }, yellow: { answered: 0, correct: 0 }, green: { answered: 0, correct: 0 } }, total: { answered: 0, correct: 0 } };
    }
  }

  const perf = useMemo(() => readPerf(), []);

  function pct(c, a) {
    if (!a) return 0;
    return Math.round((c / a) * 100);
  }

  const accGlobal = pct(perf.total.correct, perf.total.answered);
  const accRed = pct(perf.byRisk.red.correct, perf.byRisk.red.answered);
  const accYellow = pct(perf.byRisk.yellow.correct, perf.byRisk.yellow.answered);
  const accGreen = pct(perf.byRisk.green.correct, perf.byRisk.green.answered);

  const daysLeft = useMemo(() => {
    if (!examDate) return null;
    const d = new Date(examDate);
    if (isNaN(d.getTime())) return null;
    const diffMs = d.setHours(23,59,59,999) - now;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }, [examDate, now]);

  function computeReadiness() {
    if (!perf.total.answered) return { label: "Insuficiente datos", score: 0, color: "#6b7280", tips: ["Realizá al menos 40 preguntas para estimar tu preparación."] };
    // Base score ponderado por riesgo
    let base = 0.6 * accGlobal + 0.25 * accRed + 0.1 * accYellow + 0.05 * accGreen;
    // Ajuste por tiempo restante
    if (typeof daysLeft === "number") {
      if (daysLeft <= 3) base -= 10;
      else if (daysLeft <= 7) base -= 5;
      else if (daysLeft >= 21) base += 5;
    }
    base = Math.max(0, Math.min(100, Math.round(base)));
    let label = "Bajo", color = "#ef4444", tips = [
      "Reforzá preguntas de riesgo alto.",
      "Usá 'Repasar errores' y practicá 20–30 diarias.",
    ];
    if (base >= 80) {
      label = "Alto"; color = "#10b981"; tips = [
        "Mantené práctica ligera.",
        "Hacé 1 simulacro completo y repasá errores restantes.",
      ];
    } else if (base >= 60) {
      label = "Medio"; color = "#f59e0b"; tips = [
        "Consolidá riesgo alto y medio.",
        "Hacé 2 simulacros completos esta semana.",
      ];
    }
    if (typeof daysLeft === "number" && daysLeft <= 3 && label !== "Alto") {
      tips = ["Priorizá riesgo alto hoy.", "Realizá 2 bloques de 20 preguntas y repasá errores."];
    }
    return { label, score: base, color, tips };
  }

  const readiness = computeReadiness();
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
        <label style={{ marginTop: 8 }}>Fecha del examen:</label>
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate && setExamDate(e.target.value)}
        />
        {examDate && (
          <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <span className="badge">{daysLeft !== null ? (daysLeft > 0 ? `${daysLeft} días restantes` : daysLeft === 0 ? "¡Es hoy!" : "Fecha pasada") : "Fecha inválida"}</span>
            <span className="badge" style={{ background: readiness.color, color: "white" }}>
              Listo para rendir: {readiness.label}
            </span>
          </div>
        )}
        {!examDate && (
          <div className="small" style={{ marginTop: 6 }}>
            Ingresá tu fecha de examen para ver la cuenta regresiva y tu estado de preparación.
          </div>
        )}
        {perf.total.answered > 0 && (
          <div className="small" style={{ marginTop: 8 }}>
            Precisión global: {accGlobal}% · Rojo: {accRed}% · Amarillo: {accYellow}% · Verde: {accGreen}%
            <br />
            Recomendación: {readiness.tips[0]}
          </div>
        )}
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
        <button
          className="btn-ghost"
          onClick={() => start("reviewWeak")}
          disabled={weakCount === 0}
          title={weakCount === 0 ? "No hay errores guardados" : undefined}
        >
          Repasar errores ({weakCount})
        </button>
        <button className="btn-ghost" onClick={() => start("challenge")}>
          Desafío rápido
        </button>
      </div>
    </div>
  );
}
