import { Board } from './board'
import { useEngine, EngineProvider } from '../../engine'
import { Controls } from './controls'
import { useSounds } from './sounds/use-sounds'
import { useStorage, useLoadData } from './storage'
import { Box } from '../box'
import { useHistory } from './use-history'

export const Chess = () => {
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
  const history = useHistory({ FEN, board, activePiece })

  return (
    <div className="px-3 w-full sm:px-0 sm:max-w-xl sm:mx-auto">
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
        <Box pb={1}>
          <Board board={board} />
        </Box>
        <Controls />
      </EngineProvider>
    </div>
  )
}
