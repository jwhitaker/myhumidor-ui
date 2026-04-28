import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { HumidorsPage } from './pages/HumidorsPage.tsx'
import { HumidorDetailPage } from './pages/HumidorDetailPage.tsx'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="eyebrow">MyHumidor</p>
        <h1>Humidors</h1>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/humidors" replace />} />
          <Route path="/humidors" element={<HumidorsPage />} />
          <Route path="/humidors/:id" element={<HumidorDetailPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
