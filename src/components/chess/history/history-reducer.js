import { ADD, UNDO, REDO, RESET, CHANGE } from './actions'

export default (state, action) => {
  const { type } = action
  switch (type) {
    case CHANGE: {
      const { configuration } = action
      const { stack: currentStack } = state
      const stack = [...currentStack.slice(0, currentStack.length - 1), { ...configuration }]
      const head = stack.length - 1
      return {
        stack,
        head,
        current: stack[head],
      }
    }
    case ADD: {
      const { stack: currentStack, head: currentHead } = state
      const { configuration } = action
      const stack = [...currentStack.slice(0, currentHead + 1), { ...configuration }]
      const head = stack.length - 1
      return {
        stack,
        head,
        current: stack[head],
      }
    }
    case UNDO: {
      const { stack, head: currentHead } = state
      const { onAction } = action
      const head = currentHead ? currentHead - 1 : 0
      const current = stack[head]
      onAction(current)
      return {
        stack,
        head,
        current,
      }
    }
    case REDO: {
      const { stack, head: currentHead } = state
      const { onAction } = action
      const head = currentHead < stack.length - 1 ? currentHead + 1 : currentHead
      const current = stack[head]
      onAction(current)
      return {
        stack,
        head,
        current,
      }
    }
    case RESET: {
      const { onAction, configuration } = action
      const stack = [{ ...configuration }]
      const head = 0
      const current = stack[head]

      onAction(current)

      return {
        stack,
        head,
        current,
      }
    }
    default:
      return state
  }
}
