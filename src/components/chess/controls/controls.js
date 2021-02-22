import { withGame } from '../game'
import { Box } from '../../box'
// import { Button } from '../../button'
import { Reset } from './reset'

export const Controls = withGame(({ game: { reset } }) => {
  return (
    <Box flex flexRow spacex={1}>
      <Reset onClick={reset} />
      {/* <Button onClick={undo}>{'<'}</Button>
      <Button onClick={redo}>{'>'}</Button> */}
    </Box>
  )
})
