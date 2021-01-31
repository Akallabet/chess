import clsx from 'clsx'
import { bool, node, number, object } from 'prop-types'

const convertPropsToClasses = ({
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
  className,
}) => ({
  [`pb-${pb}`]: pb,
  [`px-${px}`]: !isNaN(px),
  [`mr-${mr}`]: mr,
  [`mx-${mx}`]: mx,
  [`w-${w}`]: w,
  [`w-full`]: fullWidth,
  [`max-w-${maxWidth}`]: maxWidth,
  [`flex`]: flex,
  [`flex-row`]: flexRow,
  [`space-x-${spacex}`]: spacex,
  [`${className}`]: className,
})

export const Box = ({ children, ...props }) => {
  const classes = clsx({ ...convertPropsToClasses(props) })
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
