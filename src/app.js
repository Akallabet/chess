import './styles.css'
import { Board } from './components/board'
import { useEngine, EngineProvider } from './engine'
import { I18nProvider } from './i18n'
import { Controls } from './components/controls'
import { useSounds } from './sounds/use-sounds'
import { useStorage, useLoadData } from './storage'

const App = () => {
  const { playMove } = useSounds({ hasSound: true })
  const initialData = useLoadData()

  const {
    FEN,
    board,
    activePiece,
    createRandomPiece,
    selectPiece,
    deselectPiece,
    moveActivePiece,
    reset,
  } = useEngine({
    onMove: playMove,
    initialData,
    defaultInitialData: { FEN: '8/2p5/8/8/8/8/8/8 w KQkq - 0 1' },
  })

  useStorage({ FEN, board, activePiece })
  return (
    <div className="max-w-xl mx-auto">
      <I18nProvider language="en-GB">
        <EngineProvider
          value={{
            selectPiece,
            deselectPiece,
            activePiece,
            moveActivePiece,
            createRandomPiece,
            reset,
          }}
        >
          <Board board={board} />
          <Controls />
        </EngineProvider>
      </I18nProvider>
    </div>
  )
}

export default App
