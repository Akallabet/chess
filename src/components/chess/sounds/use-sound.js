import { useState } from 'react'

const useSound = ({ src, hasSound }) => {
  const [sound] = useState(new Audio(src))
  return () => {
    sound.currentTime = 0
    if (hasSound) sound.play()
  }
}

export default useSound
