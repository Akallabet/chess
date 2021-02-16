import { func, node, string } from 'prop-types'
import GameContext from './game-context'
import { useGame } from './use-game'

export const GameProvider = ({ FEN, onMove, children }) => {
  const {
    ranks,
    files,
    board,
    activePiece,
    activeColor,
    selectPiece,
    deselectPiece,
    moveActivePiece,
    getSAN,
    reset,
    undo,
    redo,
  } = useGame({
    onMove,
    defaultInitialData: { FEN },
  })

  return (
    <GameContext.Provider
      value={{
        ranks,
        files,
        board,
        activePiece,
        activeColor,
        selectPiece,
        deselectPiece,
        moveActivePiece,
        getSAN,
        reset,
        undo,
        redo,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

GameProvider.propTypes = {
  FEN: string.isRequired,
  onMove: func,
  children: node.isRequired,
}

GameProvider.defaultProps = {
  onMove: () => {},
}
