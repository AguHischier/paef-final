import React, { useEffect, useMemo, useState } from "react";

export default function ResultsScreen({ questions, answers, restart, RISK_META, endedByLives = false }) {
  // Puntaje ponderado por riesgo para este intento (sobre todas las preguntas del set)
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
  const pct = Math.round((score / Math.max(1, maxScore)) * 100);
  const approved = !endedByLives && pct >= 70;

  // Desempeño contestado (solo preguntas respondidas) para acumular en perfStats
  const sessionPerf = useMemo(() => {
    const byRisk = { red: { answered: 0, correct: 0 }, yellow: { answered: 0, correct: 0 }, green: { answered: 0, correct: 0 } };
    let totalAnswered = 0,
      totalCorrect = 0;
    for (const q of questions) {
      const a = answers[q.id];
      if (!a) continue;
      byRisk[q.risk].answered += 1;
      totalAnswered += 1;
      if (a.correct) {
        byRisk[q.risk].correct += 1;
        totalCorrect += 1;
      }
    }
    return { byRisk, total: { answered: totalAnswered, correct: totalCorrect } };
  }, [questions, answers]);

  // Guardar perfStats acumulado en localStorage una vez al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem("perfStats");
      const prev = raw ? JSON.parse(raw) : null;
      const base = prev || { byRisk: { red: { answered: 0, correct: 0 }, yellow: { answered: 0, correct: 0 }, green: { answered: 0, correct: 0 } }, total: { answered: 0, correct: 0 } };
      const next = {
        byRisk: {
          red: {
            answered: base.byRisk.red.answered + sessionPerf.byRisk.red.answered,
            correct: base.byRisk.red.correct + sessionPerf.byRisk.red.correct,
          },
          yellow: {
            answered: base.byRisk.yellow.answered + sessionPerf.byRisk.yellow.answered,
            correct: base.byRisk.yellow.correct + sessionPerf.byRisk.yellow.correct,
          },
          green: {
            answered: base.byRisk.green.answered + sessionPerf.byRisk.green.answered,
            correct: base.byRisk.green.correct + sessionPerf.byRisk.green.correct,
          },
        },
        total: {
          answered: base.total.answered + sessionPerf.total.answered,
          correct: base.total.correct + sessionPerf.total.correct,
        },
      };
      localStorage.setItem("perfStats", JSON.stringify(next));
    } catch {}
    // no deps: lo guardamos una sola vez
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Readiness (lee examDate y perfStats acumulado)
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000 * 60);
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

  const perf = useMemo(() => readPerf(), [now]);
  const examDate = useMemo(() => {
    try {
      return localStorage.getItem("examDate") || "";
    } catch {
      return "";
    }
  }, [now]);

  function pct2(c, a) {
    if (!a) return 0;
    return Math.round((c / a) * 100);
  }
  const accGlobal = pct2(perf.total.correct, perf.total.answered);
  const accRed = pct2(perf.byRisk.red.correct, perf.byRisk.red.answered);
  const accYellow = pct2(perf.byRisk.yellow.correct, perf.byRisk.yellow.answered);
  const accGreen = pct2(perf.byRisk.green.correct, perf.byRisk.green.answered);

  const daysLeft = useMemo(() => {
    if (!examDate) return null;
    const d = new Date(examDate);
    if (isNaN(d.getTime())) return null;
    const diffMs = d.setHours(23, 59, 59, 999) - now;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }, [examDate, now]);

  function computeReadiness() {
    if (!perf.total.answered) return { label: "Insuficiente datos", score: 0, color: "#6b7280", tips: ["Realizá al menos 40 preguntas para estimar tu preparación."] };
    let base = 0.6 * accGlobal + 0.25 * accRed + 0.1 * accYellow + 0.05 * accGreen;
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
        <h1>{approved ? "✔ Aprobado" : "✖ Desaprobado"}</h1>
        {endedByLives && (
          <p className="result-fail">Perdiste las 3 vidas. El intento finalizó por vidas.</p>
        )}
        <p>
          Puntaje: {score}/{maxScore} ({pct}%)
        </p>
        <p>
          Correctas: {correct}/{questions.length}
        </p>
        {approved && <div className="badge">🏅 Medalla de Seguridad Vial</div>}

        <div style={{ marginTop: 12 }}>
          <span className="badge" style={{ background: readiness.color, color: "white" }}>
            Listo para rendir: {readiness.label}
          </span>
          <div className="small" style={{ marginTop: 6 }}>
            Recomendación: {readiness.tips[0]}
          </div>
        </div>

        <button className="btn" onClick={restart} style={{ marginTop: 20 }}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
