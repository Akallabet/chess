import { withEngine } from '../../engine'
import { Button } from '../button'
import { RandomWhitePawn } from './random-white-pawn'

export const Controls = withEngine(({ createRandomPiece, reset }) => {
  return (
    <>
      <RandomWhitePawn onClick={createRandomPiece} />
      <Button onClick={reset}>reset</Button>
    </>
  )
})
