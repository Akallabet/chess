import clsx from 'clsx'
import { bool, node, number } from 'prop-types'

export const Box = ({ pb, mr, flex, flexRow, spacex, children }) => {
  const classes = clsx({
    [`pb-${pb}`]: pb,
    [`mr-${mr}`]: mr,
    flex,
    'flex-row': flexRow,
    [`space-x-${spacex}`]: spacex,
  })
  return <div className={classes}>{children}</div>
}

Box.propTypes = {
  pb: number,
  mr: number,
  flex: bool,
  flexRow: bool,
  spacex: number,
  children: node.isRequired,
}

Box.defaultProps = {
  pb: undefined,
  mr: undefined,
  flex: false,
  flexRow: false,
  spacex: undefined,
}
