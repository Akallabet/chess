import { Board } from './board'
import { GameProvider } from './game'
import { Controls } from './controls'
import { useSounds } from './sounds/use-sounds'
import { Box } from '../box'
import { string } from 'prop-types'
import { Logs } from './logs'
import { PromotionModal } from './board/promotion-modal'

export const Chess = ({ FEN }) => {
  const { playMove } = useSounds({ hasSound: true })
  return (
    <Box px={3} fullWidth className="sm:px-0 sm:w-452 sm:mx-auto">
      <GameProvider onMove={playMove} FEN={FEN}>
        <Box pb={1}>
          <Board />
        </Box>
        <Logs />
        <Controls />
        <PromotionModal />
      </GameProvider>
    </Box>
  )
}

Chess.propTypes = {
  FEN: string.isRequired,
}
