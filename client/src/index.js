import { App } from './App'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './App.css'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
