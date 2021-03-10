import { node } from 'prop-types'

export const ModalTitle = ({ children }) => <h3>{children}</h3>

ModalTitle.propTypes = {
  children: node.isRequired,
}
