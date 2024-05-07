import { App } from './App'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import './App.css'

const container = document.getElementById('root')
const root = createRoot(container)

const queryClient = new QueryClient()

root.render(
  <BrowserRouter basename='/Turtle'>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  </BrowserRouter>
)
