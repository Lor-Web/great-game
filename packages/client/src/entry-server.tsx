import React from 'react'
import ReactDOM from 'react-dom/server'
import { SsrApp } from './pages/SsrPage'

export const render = () => ReactDOM.renderToString(<SsrApp />)
