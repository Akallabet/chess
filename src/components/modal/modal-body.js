import { node } from 'prop-types'

export const ModalBody = ({ children }) => <div>{children}</div>

ModalBody.propTypes = {
  children: node.isRequired,
}
