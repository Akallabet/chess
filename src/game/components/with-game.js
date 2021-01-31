/* eslint-disable react/display-name */
import GameContext from './game-context'

export const withGame = (Component) => (props) => {
  return (
    <GameContext.Consumer>
      {(engineProps) => <Component {...props} {...engineProps} />}
    </GameContext.Consumer>
  )
}
