import { REDO, UNDO, ADD, CHANGE, RESET } from './actions'

export const createActions = (dispatch) => ({
  add: (configuration) => dispatch({ type: ADD, configuration }),
  change: (configuration) => dispatch({ type: CHANGE, configuration }),
  undo: () => dispatch({ type: UNDO }),
  redo: () => dispatch({ type: REDO }),
  reset: () => dispatch({ type: RESET }),
})
