import { withEngine } from '../../../engine'
import { Box } from '../../box'
import { RandomWhitePawn } from './random-white-pawn'
import { Reset } from './reset'

export const Controls = withEngine(({ createRandomPiece, reset }) => {
  return (
    <Box flex flexRow spacex={1}>
      <RandomWhitePawn onClick={createRandomPiece} />
      <Reset onClick={reset} />
    </Box>
  )
})
