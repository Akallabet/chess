import './styles.css'
import { Board } from './board'
import { useEngine } from './use-engine'

import EngineContext from './engine-context'

const App = () => {
  const { board, createRandomPiece, selectPiece } = useEngine()
  return (
    <EngineContext.Provider value={{ selectPiece }}>
      <Board board={board} />
      <button onClick={() => createRandomPiece({ piece: 'p', color: 'w' })}>Add white pawn</button>
    </EngineContext.Provider>
  )
}

export default App
