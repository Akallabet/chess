import clsx from 'clsx'
import { bool, func, node } from 'prop-types'

export const Button = ({
  onClick,
  children,
  fullWidth,
  fullHeight,
  backGround,
  padding,
  ...buttonProps
}) => {
  const classes = clsx('text-secondary', 'rounded-md', 'border-secondary', 'border', {
    'p-1.5': padding,
    'bg-primary': backGround,
    'hover:bg-primary-dark': backGround,
    'w-full': fullWidth,
    'h-full': fullHeight,
  })
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
  backGround: bool,
  padding: bool,
}

Button.defaultProps = {
  onClick: () => {},
  fullWidth: false,
  fullHeight: false,
  backGround: true,
  padding: true,
}
