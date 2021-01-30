import { withGame } from '../../../game'
import { Box } from '../../box'
import { Button } from '../../button'
import { RandomWhitePawn } from './random-white-pawn'
import { Reset } from './reset'

export const Controls = withGame(({ createRandomPiece, reset, undo, redo }) => {
  return (
    <Box flex flexRow spacex={1}>
      <RandomWhitePawn onClick={createRandomPiece} />
      <Reset onClick={reset} />
      <Button onClick={undo}>{'<'}</Button>
      <Button onClick={redo}>{'>'}</Button>
    </Box>
  )
})
