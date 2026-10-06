import { useEffect, useState } from "react";
import { ShieldCheck, ShieldAlert, Search, Link2, History, Activity, LockKeyhole, AlertTriangle } from "lucide-react";

const API = "http://localhost:5000/api/scan";

export default function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadHistory() {
    try {
      const response = await fetch(`${API}/history`);
      if (response.ok) setHistory(await response.json());
    } catch { /* history is optional */ }
  }

  useEffect(() => { loadHistory(); }, []);

  async function scan(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.detail || "Scan failed");
      setResult(data);
      loadHistory();
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  const isRisky = result?.prediction === "POTENTIAL PHISHING";

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-icon"><ShieldCheck size={21}/></span> PhishGuard <b>AI</b></a>
        <span className="status"><span className="pulse"/> ML-powered URL analysis</span>
      </header>

      <main className="main">
        <section className="hero">
          <div className="eyebrow"><LockKeyhole size={14}/> CYBERSECURITY • MACHINE LEARNING</div>
          <h1>Check a link before<br/><span>you trust it.</span></h1>
          <p className="sub">Analyze URL characteristics with a machine-learning model and get a risk estimate with explainable signals.</p>
        </section>

        <section className="scan-card">
          <form onSubmit={scan}>
            <label htmlFor="url">Website URL</label>
            <div className="input-row">
              <Link2 size={20} className="link-icon"/>
              <input id="url" type="url" required placeholder="https://example.com/login" value={url} onChange={e => setUrl(e.target.value)} />
              <button type="submit" disabled={loading || !url.trim()}><Search size={17}/>{loading ? "Analyzing..." : "Scan URL"}</button>
            </div>
          </form>
          <div className="safe-note"><LockKeyhole size={14}/> This demo analyzes the URL text only; it does not open the website.</div>
        </section>

        {error && <div className="error"><AlertTriangle size={18}/>{error}</div>}

        {result && <section className={`result-card ${isRisky ? "risky" : "likely"}`}>
          <div className="result-head">
            <div className="result-icon">{isRisky ? <ShieldAlert size={25}/> : <ShieldCheck size={25}/>}</div>
            <div><span className="small-label">ANALYSIS RESULT</span><h2>{result.prediction}</h2></div>
            <div className="score"><strong>{result.riskScore}%</strong><span>model risk score</span></div>
          </div>
          <div className="meter"><div style={{width: `${Math.min(100, Math.max(0, result.riskScore))}%`}}/></div>
          <div className="scanned-url">{result.url}</div>
          <h3>Signals observed</h3>
          <ul className="reasons">{result.reasons.map((reason, i) => <li key={i}><span>•</span>{reason}</li>)}</ul>
          <p className="disclaimer">{result.disclaimer}</p>
        </section>}

        <section className="info-grid">
          <article><span className="info-icon blue"><Activity size={20}/></span><h3>URL feature analysis</h3><p>Looks at URL length, domain structure, symbols, HTTPS, and selected keyword patterns.</p></article>
          <article><span className="info-icon green"><ShieldCheck size={20}/></span><h3>Explainable signals</h3><p>See which simple URL characteristics contributed to the result.</p></article>
          <article><span className="info-icon purple"><History size={20}/></span><h3>Recent scans</h3><p>View recent scans saved to MongoDB when the database is configured.</p></article>
        </section>

        <section className="history-section">
          <div className="section-title"><div><span className="small-label">YOUR ACTIVITY</span><h2>Recent scans</h2></div><span className="count">{history.length} records</span></div>
          {history.length === 0 ? <div className="empty">No saved scans yet. Run your first URL check above.</div> :
            <div className="history-list">{history.map(item => <div className="history-item" key={item._id}>
              <span className={`history-dot ${item.prediction === "POTENTIAL PHISHING" ? "red" : "green"}`}/>
              <div className="history-url">{item.url}<small>{new Date(item.scannedAt).toLocaleString()}</small></div>
              <span className={`tag ${item.prediction === "POTENTIAL PHISHING" ? "tag-red" : "tag-green"}`}>{item.prediction}</span>
              <b className="history-score">{item.riskScore}%</b>
            </div>)}</div>}
        </section>

        <footer><ShieldCheck size={16}/> PhishGuard AI <span>Educational prototype — not a security guarantee.</span></footer>
      </main>
    </div>
  );
}
