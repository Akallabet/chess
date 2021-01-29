import { withEngine } from '../../../engine'
import { RandomWhitePawn } from './random-white-pawn'
import { Reset } from './reset'

export const Controls = withEngine(({ createRandomPiece, reset }) => {
  return (
    <>
      <RandomWhitePawn onClick={createRandomPiece} />
      <Reset onClick={reset} />
    </>
  )
})
