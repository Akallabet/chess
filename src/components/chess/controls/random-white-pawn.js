import { withI18n } from '../../../i18n'
import { Button } from '../../button'

export const RandomWhitePawn = withI18n(({ onClick, content }) => (
  <Button onClick={() => onClick({ piece: 'p', color: 'w' })}>
    {content.controls.randomWhitePawn}
  </Button>
))
