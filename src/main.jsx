import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { DiagnosticoProvider } from './state/DiagnosticoContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DiagnosticoProvider>
      <App />
    </DiagnosticoProvider>
  </React.StrictMode>,
)
