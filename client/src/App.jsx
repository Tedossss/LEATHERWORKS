import { Routes, Route } from 'react-router-dom'
import Home from './pages/home.jsx'
import Portfolio from './pages/portfolio.jsx'
import Admin from './pages/admin.jsx'
import Contact from './pages/contact.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  )
}

export default App
