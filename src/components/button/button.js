import clsx from 'clsx'
import { bool, func, node } from 'prop-types'

export const Button = ({ onClick, children, fullWidth, fullHeight, ...buttonProps }) => {
  const classes = clsx({ 'w-full': fullWidth, 'h-full': fullHeight })
  return (
    <button className={`${classes}`} onClick={onClick} {...buttonProps}>
      {children}
    </button>
  )
}

Button.propTypes = {
  onClick: func,
  children: node.isRequired,
  fullWidth: bool,
  fullHeight: bool,
}

Button.defaultProps = {
  onClick: () => {},
  fullWidth: false,
  fullHeight: false,
}
