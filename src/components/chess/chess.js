import { Board } from './board'
import { useGame, GameProvider } from '../../game'
import { Controls } from './controls'
import { useSounds } from './sounds/use-sounds'
import { Box } from '../box'
import { string } from 'prop-types'

export const Chess = ({ FEN }) => {
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
    defaultInitialData: { FEN },
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

Chess.propTypes = {
  FEN: string.isRequired,
}
