/* eslint-disable react/display-name */
import GameContext from './game-context'

export const withGame = (Component) => (props) => {
  return (
    <GameContext.Consumer>{(game) => <Component {...props} game={game} />}</GameContext.Consumer>
  )
}
