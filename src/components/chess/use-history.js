import { useEffect, useMemo, useState } from 'react'

export const useHistory = ({ FEN, board, activePiece }) => {
  const [history, setHistory] = useState([])
  const addConfiguration = (configuration) => {
    setHistory(history ? [...history, configuration] : [configuration])
  }

  useEffect(() => {
    addConfiguration({ FEN, board, activePiece })
  }, [FEN, board, activePiece])

  return {
    history,
  }
}
