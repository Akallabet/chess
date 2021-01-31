import { withI18n } from '../../../i18n'
import { Button } from '../../button'

export const Redo = withI18n(({ onClick, content }) => (
  <Button onClick={onClick}>{content.controls.redo}</Button>
))
