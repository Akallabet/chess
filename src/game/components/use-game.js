import { useState } from 'react'
import { useHistory } from '../../components/chess/history'
import { useLoadData, useStorage } from '../../components/chess/storage'
import { game } from '../game'

export const useGame = ({ onMove, defaultInitialData }) => {
  const history = useLoadData()

  const data = history ? history.current : defaultInitialData

  const [{ getInfo, select, deselect, move }, setEngine] = useState(game(data))

  const resetGame = (configuration) => setEngine(game(configuration))

  const { stack, current, head, undo, reset, add, redo } = useHistory(history, getInfo(), resetGame)

  useStorage({ stack, current, head })

  const { board, activePiece } = current

  return {
    board,
    activePiece,
    selectPiece: (args) => {
      add(select(args))
    },
    deselectPiece: (args) => {
      add(deselect(args))
    },
    moveActivePiece: (args) => {
      add(move(args))
      onMove()
    },
    reset,
    undo,
    redo,
  }
}
