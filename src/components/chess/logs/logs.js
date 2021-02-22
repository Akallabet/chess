import { withI18n } from '../../../i18n'
import { Box } from '../../box'
import { ActiveColor } from './active-color'

export const Logs = withI18n(({ content }) => (
  <Box>
    <ActiveColor content={content} />
  </Box>
))
