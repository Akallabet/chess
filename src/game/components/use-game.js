import { useState } from 'react'
import { useHistory } from '../../components/chess/history'
import { useLoadData, useStorage } from '../../components/chess/storage'
import { game } from '../game'

export const useGame = ({ onMove, defaultInitialData }) => {
  const history = useLoadData()

  const data = history ? history.current : defaultInitialData

  const [{ getInfo, selectPiece, deselectPiece, moveActivePiece }, setEngine] = useState(game(data))

  const resetGame = (configuration) => setEngine(game(configuration))

  const { stack, current, head, undo, reset, add, redo } = useHistory(history, getInfo(), resetGame)

  useStorage({ stack, current, head })

  const { board, activePiece } = current

  return {
    board,
    activePiece,
    selectPiece: (args) => {
      add(selectPiece(args))
    },
    deselectPiece: (args) => {
      add(deselectPiece(args))
    },
    moveActivePiece: (args) => {
      add(moveActivePiece(args))
      onMove()
    },
    reset,
    undo,
    redo,
  }
}
