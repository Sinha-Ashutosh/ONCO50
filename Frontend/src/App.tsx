import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import './index.css'

function useTheme() {
  const initial = useMemo(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (stored) return stored
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }, [])
  const [theme, setTheme] = useState<'light' | 'dark'>(initial)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])
  return { theme, setTheme }
}

function Layout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()
  return (
    <div>
      <header style={{ padding: '16px 20px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="row" style={{ gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: 9999, background: 'linear-gradient(90deg,#60a5fa,#a78bfa)' }} />
              <strong>Drug Resistance Predictor</strong>
            </div>
          </Link>
          <nav className="row" style={{ gap: 12 }}>
            <button
              aria-label="Toggle theme"
              className="btn secondary"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <Link to="/login" className="btn secondary">Login</Link>
            <Link to="/predict" className="btn">Open Predictor</Link>
          </nav>
        </div>
      </header>
      <main className="container">
        {children}
      </main>
    </div>
  )
}

function Home() {
  return (
    <div className="stack" style={{ gap: 24 }}>
      <section className="panel" style={{ padding: 28 }}>
        <h1 className="title">Breast Cancer Drug Response Predictor</h1>
        <p className="subtitle">A friendly tool to estimate treatment resistance from tabular biomarkers. Built for education and demos—your data stays on-device.</p>
        <div className="row" style={{ justifyContent: 'center', gap: 12 }}>
          <Link to="/predict" className="btn">Open Predictor</Link>
          <Link to="/login" className="btn secondary">Login (demo)</Link>
        </div>
      </section>

      <section className="grid cols-3">
        <div className="card">
          <h3 style={{ margin: 0, fontSize: 18 }}>About Breast Cancer</h3>
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>Breast cancer is the most common cancer in women. Molecular markers like ER/PR/HER2 and proliferation index (Ki‑67) help guide therapy selection.</p>
        </div>
        <div className="card">
          <h3 style={{ margin: 0, fontSize: 18 }}>Why Drug Response?</h3>
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>Predicting resistance can support shared decision‑making and personalization. Our demo mimics workflow used with research datasets.</p>
        </div>
        <div className="card">
          <h3 style={{ margin: 0, fontSize: 18 }}>Your Privacy</h3>
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>All predictions run locally in your browser. CSV files are processed in memory and never uploaded.</p>
        </div>
      </section>

      <section className="panel" style={{ padding: 24 }}>
        <h3 style={{ marginTop: 0 }}>How it works</h3>
        <ol style={{ color: 'var(--muted)', lineHeight: 1.8 }}>
          <li>Prepare a CSV with basic features (age, tumor size, ER/PR, HER2 …).</li>
          <li>Upload the file on the Predictor page.</li>
          <li>We run a demo model client‑side and return a resistance probability.</li>
        </ol>
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <Link to="/predict" className="btn">Start predicting</Link>
        </div>
      </section>
    </div>
  )
}

function Login() {
  return (
    <div className="panel" style={{ maxWidth: 520, margin: '0 auto', padding: 28 }}>
      <div className="title" style={{ marginTop: 0 }}>Welcome back</div>
      <div className="subtitle">Sign in to continue</div>
      <div className="stack" style={{ marginTop: 10 }}>
        <label className="label">Email</label>
        <input className="input" placeholder="you@example.com" />
        <label className="label">Password</label>
        <input className="input" placeholder="••••••••" type="password" />
        <button className="btn" style={{ width: '100%' }}>Login</button>
        <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
          No account? <Link to="/signup">Create one</Link> (demo only).
        </div>
        <div>
          <Link to="/">Back to Predictor</Link>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 16, color: 'var(--muted)', fontSize: 12 }}>Demo only, no authentication is performed.</div>
    </div>
  )
}

function Predictor() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string>('')

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }
  const handleFile = (f: File) => {
    if (!f.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file.')
      setFile(null)
      return
    }
    setFile(f)
    setError('')
  }
  const onPredict = () => {
    if (!file) {
      setError('Please select a CSV file first.')
      return
    }
    setError('')
    setTimeout(() => {
      alert(`Demo prediction complete for: ${file.name}\nTop class: Resistant (0.71)`) // mock
    }, 400)
  }
  const downloadSample = () => {
    const sample = 'Age,TumorSize,ER,PR,HER2\n52,28,Positive,Negative,1+\n61,34,Negative,Negative,3+'
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample_input.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="panel" style={{ padding: 24 }}>
      <div className="title" style={{ marginTop: 0 }}>CSV Predictor</div>
      <div className="subtitle">Upload your CSV and run predictions. No upload leaves your device.</div>

      <div
        className="dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 26, marginBottom: 6 }}>☁️</div>
          <div style={{ fontWeight: 600 }}>Drop file here</div>
          <div className="hint">or</div>
          <label className="btn secondary" style={{ cursor: 'pointer' }}>
            Choose file
            <input
              type="file"
              accept=".csv"
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
          </label>
          <div className="hint" style={{ marginTop: 6 }}>CSV only</div>
        </div>
      </div>

      <div className="row" style={{ gap: 12, marginTop: 16 }}>
        <button className="btn secondary" onClick={() => file ? alert(`Selected: ${file.name}`) : setError('Please select a CSV file first.')}>Upload CSV</button>
        <button className="btn" onClick={onPredict}>Predict</button>
      </div>

      <div className="hint" style={{ marginTop: 16 }}>
        Expected columns should match the training features. If your CSV contains an LN_IC50 column, it will be ignored during prediction and preserved in the output for comparison.
      </div>
      {error && <div className="error" style={{ marginTop: 10 }}>{error}</div>}

      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn secondary" onClick={downloadSample}>Download sample input format</button>
      </div>

      <div className="hint" style={{ textAlign: 'center', marginTop: 18 }}>
        Model and pipeline are served locally. No data is uploaded to the internet.
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/predict" element={<Predictor />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
