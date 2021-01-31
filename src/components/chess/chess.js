import { Board } from './board'
import { GameProvider } from '../../game'
import { Controls } from './controls'
import { useSounds } from './sounds/use-sounds'
import { Box } from '../box'
import { string } from 'prop-types'

export const Chess = ({ FEN }) => {
  const { playMove } = useSounds({ hasSound: true })

  return (
    <Box px={3} fullWidth sm={{ px: 0, mx: 'auto', w: 452 }}>
      <GameProvider onMove={playMove} FEN={FEN}>
        <Box pb={1}>
          <Board />
        </Box>
        <Controls />
      </GameProvider>
    </Box>
  )
}

Chess.propTypes = {
  FEN: string.isRequired,
}
