import { Notation } from './notation'

export const Number = ({ children, isWhite }) => (
  <Notation isWhite={isWhite} className="left-1 top-0">
    {children}
  </Notation>
)
