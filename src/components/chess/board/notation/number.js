import { bool, node } from 'prop-types'
import { Notation } from './notation'

export const Number = ({ children, isWhite }) => (
  <Notation isWhite={isWhite} className="left-1 top-0">
    {children}
  </Notation>
)

Number.propTypes = {
  children: node.isRequired,
  isWhite: bool.isRequired,
}
