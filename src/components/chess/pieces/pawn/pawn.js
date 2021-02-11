import whitePawn from './white-pawn.svg'
import blackPawn from './black-pawn.svg'
import { string } from 'prop-types'

export const Pawn = ({ color }) => {
  const src = color === 'w' ? whitePawn : blackPawn
  const alt = color === 'w' ? 'pawn-white' : 'pawn-black'
  return <img src={src} alt={alt} className="w-full h-full" />
}

Pawn.propTypes = {
  color: string.isRequired,
}
