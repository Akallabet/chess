import { withEngine } from '../../engine'
import { RandomWhitePawn } from './random-white-pawn'

export const Controls = withEngine(({ createRandomPiece }) => {
  return <RandomWhitePawn onClick={createRandomPiece} />
})
