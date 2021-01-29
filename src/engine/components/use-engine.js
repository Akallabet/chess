import { useMemo, useState } from 'react'
import { engine } from '../engine'

export const useEngine = ({ onMove, initialData, defaultInitialData }) => {
  const {
    getInfo,
    createRandomPiece,
    selectPiece,
    deselectPiece,
    moveActivePiece,
    reset,
  } = useMemo(() => engine(initialData || defaultInitialData), [initialData])
  const [info, setInfo] = useState(getInfo())

  return {
    ...info,
    createRandomPiece: (args) => {
      setInfo(createRandomPiece(args))
    },
    selectPiece: (args) => {
      setInfo(selectPiece(args))
    },
    deselectPiece: (args) => {
      setInfo(deselectPiece(args))
    },
    moveActivePiece: (args) => {
      setInfo(moveActivePiece(args))
      onMove()
    },
    reset: () => {
      setInfo(reset(defaultInitialData))
    },
  }
}
