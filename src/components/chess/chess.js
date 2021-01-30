import { Board } from './board'
import { useGame, GameProvider } from '../../game'
import { Controls } from './controls'
import { useSounds } from './sounds/use-sounds'
import { Box } from '../box'

const defaultFEN = '8/2p5/8/8/8/8/8/8 w KQkq - 0 1'

const defaultInitialData = {
  FEN: defaultFEN,
}

export const Chess = () => {
  const { playMove } = useSounds({ hasSound: true })

  const {
    board,
    activePiece,
    createRandomPiece,
    selectPiece,
    deselectPiece,
    moveActivePiece,
    reset,
    undo,
    redo,
  } = useGame({
    onMove: playMove,
    defaultInitialData,
  })

  return (
    <div className="px-3 w-full sm:px-0 sm:max-w-xl sm:mx-auto">
      <GameProvider
        value={{
          selectPiece,
          deselectPiece,
          activePiece,
          moveActivePiece,
          createRandomPiece,
          reset,
          undo,
          redo,
        }}
      >
        <Box pb={1}>
          <Board board={board} />
        </Box>
        <Controls />
      </GameProvider>
    </div>
  )
}
