import './styles.css'
import { Board } from './board'
import { useMemo, useState } from 'react'
import { engine } from './engine'

const useEngine = () => {
  const { getInfo, createRandomPiece } = useMemo(
    () => engine({ FEN: '8/2p5/8/8/8/8/8/8 w KQkq - 0 1' }),
    []
  )
  const [info, setInfo] = useState(getInfo())

  return {
    ...info,
    createRandomPiece: (piece) => {
      setInfo(createRandomPiece(piece))
    },
  }
}

const App = () => {
  const { board, createRandomPiece } = useEngine()
  return (
    <>
      <Board board={board} />
      <button onClick={() => createRandomPiece('P')}>Add white pawn</button>
    </>
  )
}

export default App
