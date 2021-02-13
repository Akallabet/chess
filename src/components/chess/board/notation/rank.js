import { bool, node } from 'prop-types'
import { Notation } from './notation'

export const Rank = ({ children, isWhite }) => (
  <Notation isWhite={isWhite} className="left-1 top-0">
    {children}
  </Notation>
)

Rank.propTypes = {
  children: node.isRequired,
  isWhite: bool.isRequired,
}
