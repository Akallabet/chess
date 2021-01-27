import { render } from '@testing-library/react'

import App from './app'
test('Should display an empty board', () => {
  const { getAllByTestId } = render(<App />)

  expect(getAllByTestId('board').length).toEqual(1)
  expect(getAllByTestId('row').length).toEqual(8)
  expect(getAllByTestId('cell-white').length).toEqual(32)
  expect(getAllByTestId('cell-black').length).toEqual(32)
})
