import { bool, node, string } from 'prop-types'

export const Notation = ({ children, isWhite, className }) => {
  return (
    <p className={`absolute ${isWhite ? 'text-primary' : 'text-secondary'} ${className}`}>
      {children}
    </p>
  )
}

Notation.propTypes = {
  children: node.isRequired,
  isWhite: bool.isRequired,
  className: string.isRequired,
}
