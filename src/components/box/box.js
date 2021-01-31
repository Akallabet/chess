import clsx from 'clsx'
import { bool, node, number, object } from 'prop-types'

const convertPropsToClasses = (modifier) => ({
  pb,
  px,
  mr,
  mx,
  w,
  flex,
  flexRow,
  spacex,
  fullWidth,
  maxWidth,
}) => ({
  [`${modifier}${modifier}pb-${pb}`]: pb,
  [`${modifier}px-${px}`]: !isNaN(px),
  [`${modifier}mr-${mr}`]: mr,
  [`${modifier}mx-${mx}`]: mx,
  [`${modifier}w-${w}`]: w,
  [`${modifier}w-full`]: fullWidth,
  [`${modifier}max-w-${maxWidth}`]: maxWidth,
  [`${modifier}flex`]: flex,
  [`${modifier}flex-row`]: flexRow,
  [`${modifier}space-x-${spacex}`]: spacex,
})

export const Box = ({ children, sm, ...props }) => {
  let propsToClasses = { ...convertPropsToClasses('')(props) }
  if (sm) {
    propsToClasses = {
      ...propsToClasses,
      ...convertPropsToClasses('sm:')(sm),
    }
  }
  const classes = clsx(propsToClasses)
  return <div className={classes}>{children}</div>
}

Box.propTypes = {
  pb: number,
  px: number,
  mr: number,
  w: number,
  fullWidth: bool,
  flex: bool,
  flexRow: bool,
  spacex: number,
  sm: object,
  children: node.isRequired,
}

Box.defaultProps = {
  pb: undefined,
  px: undefined,
  mr: undefined,
  fullWidth: false,
  flex: false,
  flexRow: false,
  spacex: undefined,
  sm: undefined,
}
