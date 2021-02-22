import { withGame } from '../game'

export const ActiveColor = withGame(({ game: { activeColor }, content }) => (
  <p>{content.activeColor[activeColor]}</p>
))
