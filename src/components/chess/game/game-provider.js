import { func, node, string } from 'prop-types'
import GameContext from './game-context'
import { useGame } from './use-game'

export const GameProvider = ({ FEN, onMove, children }) => {
  const game = useGame({
    onMove,
    defaultInitialData: { FEN },
  })

  return <GameContext.Provider value={game}>{children}</GameContext.Provider>
}

GameProvider.propTypes = {
  FEN: string.isRequired,
  onMove: func,
  children: node.isRequired,
}

GameProvider.defaultProps = {
  onMove: () => {},
}
