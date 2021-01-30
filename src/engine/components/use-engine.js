import { useMemo } from 'react'
import { useHistory } from '../../components/chess/history'
import { useLoadData, useStorage } from '../../components/chess/storage'
import { engine } from '../engine'

export const useEngine = ({ onMove, defaultInitialData }) => {
  const history = useLoadData()

  const data = history ? history.current : defaultInitialData
  const { getInfo, createRandomPiece, selectPiece, deselectPiece, moveActivePiece } = useMemo(
    () => engine(data),
    [data]
  )

  const { stack, current, head, undo, reset, add, redo } = useHistory(history, getInfo())

  useStorage({ stack, current, head })
  const { board, activePiece } = current

  return {
    board,
    activePiece,
    createRandomPiece: (args) => {
      add(createRandomPiece(args))
    },
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
