import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            border: '3px solid #1b1c1a',
            borderRadius: '12px',
            fontWeight: '700',
            fontFamily: 'Plus Jakarta Sans',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
          }
        }}
      />
    </BrowserRouter>
  </StrictMode>
)