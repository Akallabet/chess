import { useReducer } from 'react'
import { createActions } from './action-creator'
import historyReducer from './history-reducer'

export const useHistory = (history, info, onAction) => {
  const [state, dispatch] = useReducer(
    historyReducer,
    history || {
      stack: [{ ...info }],
      current: { ...info },
      head: 0,
    }
  )
  const actions = createActions(dispatch, onAction)
  const { stack, current, head } = state

  return {
    stack,
    current,
    head,
    ...actions,
  }
}
