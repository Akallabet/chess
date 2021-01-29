import { withI18n } from '../../../i18n'
import { Button } from '../../button'

export const Reset = withI18n(({ onClick, content }) => (
  <Button onClick={onClick}>{content.controls.reset}</Button>
))
