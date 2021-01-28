import { useMemo, useState } from 'react'
import { engine } from './engine'

export const useEngine = () => {
  const { getInfo, createRandomPiece, getLegalMoves } = useMemo(
    () => engine({ FEN: '8/2p5/8/8/8/8/8/8 w KQkq - 0 1' }),
    []
  )
  const [info, setInfo] = useState(getInfo())

  return {
    ...info,
    createRandomPiece: (args) => {
      setInfo(createRandomPiece(args))
    },
    getLegalMoves: (args) => {
      setInfo(getLegalMoves(args))
    },
  }
}
