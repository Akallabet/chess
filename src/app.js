import './styles.css'
import { Board } from './board'
import { useMemo } from 'react'
import { engine } from './engine'

const App = () => {
  const { board } = useMemo(() => {
    const { getInfo } = engine()

    return getInfo()
  }, [])
  return <Board board={board} />
}

export default App
