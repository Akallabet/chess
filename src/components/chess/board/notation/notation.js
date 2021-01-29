export const Notation = ({ children, isWhite, className }) => {
  return (
    <p className={`absolute ${isWhite ? 'text-whiteCell' : 'text-blackCell'} ${className}`}>
      {children}
    </p>
  )
}
