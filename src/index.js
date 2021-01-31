import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

const FEN = '8/2p5/8/8/8/8/8/8 w KQkq - 0 1'

ReactDOM.render(
  <React.StrictMode>
    <App FEN={FEN} />
  </React.StrictMode>,
  document.getElementById('root')
)
