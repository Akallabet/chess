import { REDO, UNDO, ADD, CHANGE, RESET } from './actions'

export const createActions = (dispatch, onAction) => ({
  add: (configuration) => dispatch({ type: ADD, configuration }),
  change: (configuration) => dispatch({ type: CHANGE, configuration }),
  undo: () => dispatch({ type: UNDO, onAction }),
  redo: () => dispatch({ type: REDO, onAction }),
  reset: (configuration) => dispatch({ type: RESET, configuration, onAction }),
})
