import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import { queryStringToObject } from './utils'

const { FEN } = queryStringToObject(location.search)

ReactDOM.render(
  <React.StrictMode>
    <App FEN={FEN} />
  </React.StrictMode>,
  document.getElementById('root')
)
