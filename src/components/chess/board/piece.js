import { func, string } from 'prop-types'
import { Button } from '../../button'

import assets from './assets'

export const Piece = ({ name, color, label, onClick }) => (
  <Button
    fullWidth
    fullHeight
    backGround={false}
    padding={false}
    borders={false}
    aria-label={label}
    onClick={onClick}
  >
    <img src={assets[color][name]} className="w-full h-full" />
  </Button>
)

Piece.displayName = 'Piece'

Piece.propTypes = {
  name: string.isRequired,
  color: string.isRequired,
  label: string.isRequired,
  onClick: func.isRequired,
}
