import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import Home from '../layouts/Home'
import Project from '../layouts/Project'

function LegacyProjectRedirect() {
  const { projectId } = useParams<{ projectId: string }>()
  return <Navigate to={`/tunnelbox/${encodeURIComponent(projectId ?? '')}`} replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tunnelbox/:projectId" element={<Project />} />
        <Route path="/project/:projectId" element={<LegacyProjectRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App