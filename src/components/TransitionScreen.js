import React from "react";

export default function TransitionScreen({ title, subtitle, onContinue }) {
  return (
    <div className="app">
      <div className="card" style={{ textAlign: "center" }}>
        <h1 style={{ marginBottom: 8 }}>{title}</h1>
        {subtitle && <p className="small" style={{ marginTop: 0 }}>{subtitle}</p>}
        <div style={{ fontSize: 60, margin: "16px 0" }}>🚗🛑</div>
        <button className="btn" onClick={onContinue}>Continuar</button>
      </div>
    </div>
  );
}
