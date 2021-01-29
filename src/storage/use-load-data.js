import { useMemo } from 'react'

export const useLoadData = () => {
  return useMemo(() => JSON.parse(localStorage.getItem('chess')), [])
}
