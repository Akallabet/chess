import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import { queryStringToObject } from './utils'

const { FEN } = queryStringToObject(location.search)

if (!FEN) location.search = `?FEN=rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR_w_KQkq_-_0_1`

ReactDOM.render(
  <React.StrictMode>
    <App FEN={FEN} />
  </React.StrictMode>,
  document.getElementById('root')
)
