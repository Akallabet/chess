import { Notation } from './notation'

export const Letter = ({ children, isWhite }) => (
  <Notation isWhite={isWhite} className="right-0.5 bottom-0">
    {children}
  </Notation>
)
