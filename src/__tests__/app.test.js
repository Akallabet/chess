import { render, within, fireEvent } from '@testing-library/react'
import App from '../app'

test('Should display a chess board', () => {
  const { getByTestId } = render(<App />)

  const board = getByTestId('board')

  expect(board).toBeDefined()
  ;[...Array(8)]
    .map((_, i) => i + 1)
    .forEach((number) =>
      ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach((letter) => {
        expect(getByTestId(`${letter}${number}`)).toBeDefined()
      })
    )
  expect(within(board).getByText('1')).toBeDefined()
  expect(within(board).getByText('2')).toBeDefined()
  expect(within(board).getByText('3')).toBeDefined()
  expect(within(board).getByText('4')).toBeDefined()
  expect(within(board).getByText('5')).toBeDefined()
  expect(within(board).getByText('6')).toBeDefined()
  expect(within(board).getByText('7')).toBeDefined()
  expect(within(board).getByText('8')).toBeDefined()
  expect(within(board).getByText('a')).toBeDefined()
  expect(within(board).getByText('b')).toBeDefined()
  expect(within(board).getByText('c')).toBeDefined()
  expect(within(board).getByText('d')).toBeDefined()
  expect(within(board).getByText('e')).toBeDefined()
  expect(within(board).getByText('f')).toBeDefined()
  expect(within(board).getByText('g')).toBeDefined()
  expect(within(board).getByText('h')).toBeDefined()
})

test('Should display a black pawn', () => {
  const { getByRole } = render(<App />)
  expect(getByRole('button', { name: /p b c2/i })).toBeDefined()
})

test('Should add a random white pawn', () => {
  const { getByRole } = render(<App />)
  fireEvent.click(getByRole('button', { name: /Add white pawn/i }))
  expect(getByRole('button', { name: /p w/i })).toBeDefined()
})

test('Should move a pown on the board', () => {
  const { getByTestId, getByRole } = render(<App />)
  fireEvent.click(getByRole('button', { name: /p b c2/i }))
  fireEvent.click(getByTestId('c3'))
  expect(getByRole('button', { name: /p b c3/i })).toBeDefined()
})

test('Should play a sound when moving a piece', () => {
  const { getByTestId, getByRole } = render(<App />)
  fireEvent.click(getByRole('button', { name: /p b c2/i }))
  fireEvent.click(getByTestId('c3'))
  expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1)
})

test('Should reset the board', async () => {
  const { getByTestId, getByRole, queryByRole } = render(<App />)
  fireEvent.click(getByRole('button', { name: /p b c2/i }))
  fireEvent.click(getByTestId('c3'))
  expect(getByRole('button', { name: /p b c3/i })).toBeDefined()
  expect(queryByRole('button', { name: /p b c2/i })).toBeNull()
  fireEvent.click(getByRole('button', { name: /reset/i }))
  expect(getByRole('button', { name: /p b c2/i })).toBeDefined()
})

test('Should undo a move', async () => {
  const { getByTestId, getByRole, queryByRole } = render(<App />)
  fireEvent.click(getByRole('button', { name: /p b c2/i }))
  fireEvent.click(getByTestId('c4'))
  expect(getByRole('button', { name: /p b c4/i })).toBeDefined()
  expect(queryByRole('button', { name: /p b c2/i })).toBeNull()

  fireEvent.click(getByRole('button', { name: /</i }))
  expect(getByRole('button', { name: /p b c2/i })).toBeDefined()
  expect(queryByRole('button', { name: /p b c4/i })).toBeNull()
})

test('Should not redo if at the end of the history stack', async () => {
  const { getByRole } = render(<App />)
  fireEvent.click(getByRole('button', { name: />/i }))
  expect(getByRole('button', { name: /p b c2/i })).toBeDefined()
})

test('Should redo several moves', async () => {
  const { getByTestId, getByRole, queryByRole } = render(<App />)
  fireEvent.click(getByRole('button', { name: /p b c2/i }))
  fireEvent.click(getByTestId('c4'))
  fireEvent.click(getByRole('button', { name: /p b c4/i }))
  fireEvent.click(getByTestId('c5'))
  fireEvent.click(getByRole('button', { name: /p b c5/i }))
  fireEvent.click(getByTestId('c6'))

  expect(getByRole('button', { name: /p b c6/i })).toBeDefined()
  expect(queryByRole('button', { name: /p b c2/i })).toBeNull()

  fireEvent.click(getByRole('button', { name: /</i }))
  fireEvent.click(getByRole('button', { name: /</i }))
  fireEvent.click(getByRole('button', { name: /</i }))
  fireEvent.click(getByRole('button', { name: /</i }))
  fireEvent.click(getByRole('button', { name: /</i }))
  fireEvent.click(getByRole('button', { name: /</i }))

  expect(getByRole('button', { name: /p b c2/i })).toBeDefined()
  expect(queryByRole('button', { name: /p b c6/i })).toBeNull()

  fireEvent.click(getByRole('button', { name: />/i }))
  fireEvent.click(getByRole('button', { name: />/i }))
  fireEvent.click(getByRole('button', { name: />/i }))
  fireEvent.click(getByRole('button', { name: />/i }))
  fireEvent.click(getByRole('button', { name: />/i }))
  fireEvent.click(getByRole('button', { name: />/i }))

  expect(getByRole('button', { name: /p b c6/i })).toBeDefined()
  expect(queryByRole('button', { name: /p b c2/i })).toBeNull()
})

test('Should write new history after going back', async () => {
  const { getByTestId, getByRole, queryByRole } = render(<App />)
  fireEvent.click(getByRole('button', { name: /p b c2/i }))
  fireEvent.click(getByTestId('c4'))
  fireEvent.click(getByRole('button', { name: /</i }))
  fireEvent.click(getByTestId('c3'))

  expect(getByRole('button', { name: /p b c3/i })).toBeDefined()
  expect(queryByRole('button', { name: /p b c2/i })).toBeNull()
  expect(queryByRole('button', { name: /p b c4/i })).toBeNull()
})
