import React from "react";

export default function FeedbackScreen({ data, answer, goNext }) {
  const { correct, question } = data;
  const correctOpt = question.options.find((o) => o.correct);

  return (
    <div className="app">
      <div className="card" style={{ textAlign: "center" }}>
        <h1 style={{ color: correct ? "green" : "red" }}>
          {correct ? "✅ ¡Correcto!" : "❌ Incorrecto"}
        </h1>

        <p>{question.explanation}</p>

        {correct && question.image && (
          <img
            src={question.image}
            alt="ilustración"
            style={{ maxWidth: "80%", margin: "10px auto" }}
          />
        )}

        {!correct && (
          <>
            {question.impactImage && (
              <img
                src={question.impactImage}
                alt="impacto"
                style={{
                  maxWidth: "90%",
                  margin: "10px auto",
                  borderRadius: "12px",
                }}
              />
            )}
            {question.resources?.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <h4>Recursos:</h4>
                <ul>
                  {question.resources.map((r, i) => (
                    <li key={i}>
                      <a
                        className="link"
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {r.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="small">
              La respuesta correcta era: {correctOpt.text}
            </p>
          </>
        )}

        <button className="btn" onClick={goNext} style={{ marginTop: 20 }}>
          Siguiente
        </button>
      </div>
    </div>
  );
}
