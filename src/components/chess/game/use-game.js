import { useEffect, useState } from 'react'
import { useLoadData, useStorage } from '../storage'
import { game } from '../../../game'

export const useGame = ({ onMove, defaultInitialData }) => {
  const data = useLoadData() || defaultInitialData

  const [{ getInfo, moves, move }, setEngine] = useState(() => game(data))

  const resetGame = () => {
    setEngine(game(defaultInitialData))
  }

  const [info, setInfo] = useState(getInfo())
  const { board, activeColor, FEN, ranks, files, getSAN } = info

  const [activePiece, setActivePiece] = useState()

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
    selectPiece: (piece) => {
      const { file, rank } = piece
      setActivePiece(piece)
      setInfo({ ...info, board: moves(`${file}${rank}`) })
    },
    deselectPiece: () => {
      setActivePiece()
      setInfo(getInfo())
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
