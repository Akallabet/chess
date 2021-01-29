import { useEffect } from 'react'

export const useStorage = ({ FEN, board, activePiece }) => {
  useEffect(() => {
    localStorage.setItem('chess', JSON.stringify({ FEN, board, activePiece }))
  }, [FEN, board, activePiece])
}
