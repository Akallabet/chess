import moveSound from './assets/move.mp3'

import useSound from './use-sound'

export const useSounds = ({ hasSound }) => {
  const playMove = useSound({
    src: moveSound,
    hasSound,
  })
  return {
    playMove,
  }
}
