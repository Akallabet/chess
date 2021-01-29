import './styles.css'
import { Board } from './components/board'
import { useEngine, EngineProvider } from './engine'
import { I18nProvider } from './i18n'
import { Controls } from './components/controls'
import { useSounds } from './sounds/use-sounds'

const App = () => {
  const { playMove } = useSounds({ hasSound: true })
  const {
    board,
    activePiece,
    createRandomPiece,
    selectPiece,
    deselectPiece,
    moveActivePiece,
  } = useEngine({ onMove: playMove })
  return (
    <I18nProvider language="en-GB">
      <EngineProvider
        value={{ selectPiece, deselectPiece, activePiece, moveActivePiece, createRandomPiece }}
      >
        <Board board={board} />
        <Controls />
      </EngineProvider>
    </I18nProvider>
  )
}

export default App
