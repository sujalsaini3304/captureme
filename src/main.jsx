import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Footer from './components/created_ui/Footer.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <div className="min-h-screen flex flex-col">
      
      <div className="flex-1 pt-14">
        <App />
      </div>

      <Footer />

    </div>
  </BrowserRouter>
)
