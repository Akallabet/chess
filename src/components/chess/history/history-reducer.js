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
      const { stack: currentStack } = state
      const { configuration } = action
      const stack = [...currentStack, { ...configuration }]
      const head = stack.length - 1
      return {
        stack,
        head,
        current: stack[head],
      }
    }
    case UNDO: {
      const { stack, head: currentHead } = state
      const head = currentHead ? currentHead - 1 : 0
      return {
        stack,
        head,
        current: stack[head],
      }
    }
    case REDO: {
      const { stack, head: currentHead } = state
      const head = currentHead < stack.length - 1 ? currentHead + 1 : currentHead
      return {
        stack,
        head,
        current: stack[head],
      }
    }
    case RESET: {
      const { stack: currentStack } = state
      const stack = [{ ...currentStack[0] }]
      const head = 0
      return {
        stack: [{ ...stack[0] }],
        head,
        current: stack[head],
      }
    }
    default:
      return state
  }
}
