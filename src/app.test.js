import { render } from '@testing-library/react'

import App from './app'
test('Should display a chess board', () => {
  const { getAllByTestId, getByText } = render(<App />)

  expect(getAllByTestId('board').length).toEqual(1)
  expect(getAllByTestId('row').length).toEqual(8)
  expect(getAllByTestId('cell-white').length).toEqual(32)
  expect(getAllByTestId('cell-black').length).toEqual(32)
  expect(getByText('1')).toBeDefined()
  expect(getByText('2')).toBeDefined()
  expect(getByText('3')).toBeDefined()
  expect(getByText('4')).toBeDefined()
  expect(getByText('5')).toBeDefined()
  expect(getByText('6')).toBeDefined()
  expect(getByText('7')).toBeDefined()
  expect(getByText('8')).toBeDefined()
  expect(getByText('a')).toBeDefined()
  expect(getByText('b')).toBeDefined()
  expect(getByText('c')).toBeDefined()
  expect(getByText('d')).toBeDefined()
  expect(getByText('e')).toBeDefined()
  expect(getByText('f')).toBeDefined()
  expect(getByText('g')).toBeDefined()
  expect(getByText('h')).toBeDefined()
})
