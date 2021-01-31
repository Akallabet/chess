import { node } from 'prop-types'

export const Section = ({ children }) => <section className="py-10">{children}</section>

Section.propTypes = {
  children: node.isRequired,
}
