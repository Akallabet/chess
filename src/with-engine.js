import React from 'react'
import EngineContext from './engine-context'

const withEngine = (Component) => (props) => {
  return (
    <EngineContext.Consumer>
      {(engineProps) => <Component {...props} {...engineProps} />}
    </EngineContext.Consumer>
  )
}

export default withEngine
