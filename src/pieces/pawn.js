import whitePawn from './white-pawn.svg'
import blackPawn from './black-pawn.svg'

export const Pawn = ({ color }) => {
  const src = color === 'P' ? whitePawn : blackPawn
  const alt = color === 'P' ? 'pawn-white' : 'pawn-black'
  return <img src={src} alt={alt} className="w-full h-full" />
}
