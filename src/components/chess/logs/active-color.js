import { withI18n } from '../../../i18n'
import { withGame } from '../game'

export const ActiveColor = withGame(({ activeColor, content }) => (
  <p>{content.activeColor[activeColor]}</p>
))
