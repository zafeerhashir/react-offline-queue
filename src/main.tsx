import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from "react-redux";
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react';


import App from './App.tsx'
import './index.css'
import store, { persistedStore } from './store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <App />
      </PersistGate>
      </Provider>
  </React.StrictMode>,
)
