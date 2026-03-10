import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import store from './redux/store'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#e0e0e0',
              border: '1px solid rgba(229, 9, 20, 0.3)',
              fontFamily: 'DM Sans, sans-serif'
            },
            success: { iconTheme: { primary: '#e50914', secondary: '#fff' } }
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
