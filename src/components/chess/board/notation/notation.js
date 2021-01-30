export const Notation = ({ children, isWhite, className }) => {
  return (
    <p className={`absolute ${isWhite ? 'text-primary' : 'text-secondary'} ${className}`}>
      {children}
    </p>
  )
}
