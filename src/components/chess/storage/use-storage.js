import { useEffect } from 'react'

export const useStorage = (data) => {
  useEffect(() => {
    localStorage.setItem('chess', JSON.stringify(data))
  }, [data])
}
