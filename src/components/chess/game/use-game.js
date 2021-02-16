import { useEffect, useState } from 'react'
import { useLoadData, useStorage } from '../storage'
import { game } from '../../../game'

export const useGame = ({ onMove, defaultInitialData }) => {
  const data = useLoadData() || defaultInitialData

  const [{ getInfo, select, deselect, move }, setEngine] = useState(game(data))

  const resetGame = () => {
    setEngine(game(defaultInitialData))
  }

  const [{ board, activePiece, activeColor, FEN, ranks, files, getSAN }, setInfo] = useState(
    getInfo()
  )

  useEffect(() => {
    setInfo(getInfo())
  }, [getInfo])
  useStorage({ board, activePiece, FEN })

  return {
    board,
    activePiece,
    activeColor,
    ranks,
    getSAN,
    files,
    selectPiece: (args) => {
      setInfo(select(args))
    },
    deselectPiece: (args) => {
      setInfo(deselect(args))
    },
    moveActivePiece: (args) => {
      setInfo(move(args))
      onMove()
    },
    reset: () => {
      resetGame()
    },
  }
}
