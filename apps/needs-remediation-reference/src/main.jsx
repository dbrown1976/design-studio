import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const frames = [
  { stage: "baseline", title: "Baseline", toolbar: "Malicious messages · not remediated · last 7 days", columns: ["Subject","Sender","Received","Verdict"] },
  { stage: "exploration", title: "A · Definition outside", toolbar: "Definition: malicious, not remediated, last 7 days", columns: ["Subject","Sender","Received","Verdict"] },
  { stage: "exploration", title: "B · Task-first toolbar", toolbar: "Needs Remediation — narrow within: Rule matched · Sender · Severity", columns: ["Subject","Sender","Received","Verdict","Rule Matched"] },
  { stage: "hifi", title: "HiFi · Task-first", toolbar: "Needs Remediation — narrow within: Rule matched · Sender · Severity · Attack type", columns: ["Subject","Sender","Received","Verdict","Rule Matched"] }
];

function Frame({ item, active, onClick }) {
  return <button className={`frame ${active ? "active" : ""}`} onClick={onClick}>
    <div className="toolbar">{item.toolbar}</div>
    <div className="table">
      <div className="row head">{item.columns.map(c => <span key={c}>{c}</span>)}</div>
      {[0,1,2,3,4].map(r => <div className="row" key={r}>{item.columns.map(c => <span className="cell" key={c}/>)}</div>)}
    </div>
    <div className="caption"><span className={`pill ${item.stage}`}>{item.stage}</span><strong>{item.title}</strong></div>
  </button>;
}

function App(){
  const [active, setActive] = useState(3);
  return <main>
    <header><p>Design Studio / Reference prototype</p><h1>Needs Remediation</h1><span>Baseline → divergent structural bets → converged HiFi</span></header>
    <section className="board">{frames.map((f,i) => <Frame key={f.title} item={f} active={active===i} onClick={() => setActive(i)}/>)}</section>
    <aside><strong>{frames[active].title}</strong><p>{active===0 ? "Trusted production starting point." : active===1 ? "Move the fixed view definition outside the filter model." : active===2 ? "Make the task and narrowing controls the dominant toolbar model." : "Converged product-fidelity direction preserving the production table."}</p></aside>
  </main>
}
createRoot(document.getElementById("root")).render(<App/>);
