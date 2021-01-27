import { render, within, fireEvent } from '@testing-library/react'

import App from './app'
test('Should display a chess board', () => {
  const { getAllByTestId, getByTestId, getByText } = render(<App />)

  const board = getByTestId('board')

  expect(board).toBeDefined()
  expect(getAllByTestId('row').length).toEqual(8)
  expect(getAllByTestId('cell-white').length).toEqual(32)
  expect(getAllByTestId('cell-black').length).toEqual(32)
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
  const { getByAltText, getByTestId } = render(<App />)
  const board = getByTestId('board')
  expect(within(board).getByAltText('pawn-black')).toBeDefined()
})

test('Should add a random white pawn', () => {
  const { getByAltText, getByTestId, getByRole } = render(<App />)
  const board = getByTestId('board')
  fireEvent.click(getByRole('button', { name: /Add white pawn/i }))
  expect(within(board).getByAltText('pawn-white')).toBeDefined()
})
