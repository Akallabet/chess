import { bool, node } from 'prop-types'
import { Notation } from './notation'

export const File = ({ children, isWhite }) => (
  <Notation isWhite={isWhite} className="right-0.5 bottom-0">
    {children}
  </Notation>
)

File.propTypes = {
  children: node.isRequired,
  isWhite: bool.isRequired,
}
