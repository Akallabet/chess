import { withI18n } from '../../i18n'

export const RandomWhitePawn = withI18n(({ onClick, content }) => (
  <button onClick={() => onClick({ piece: 'p', color: 'w' })}>
    {content.controls.randomWhitePawn}
  </button>
))
