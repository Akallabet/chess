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
  expect(getByRole('button', { name: 'P b c7' })).toBeDefined()
})

test('Should move a pawn on the board', () => {
  const { getByTestId, getByRole } = render(<App />)
  fireEvent.click(getByRole('button', { name: 'P w c2' }))
  fireEvent.click(getByTestId('c4'))
  expect(getByRole('button', { name: 'P w c4' })).toBeDefined()
})

test('Should play a sound when moving a piece', () => {
  const { getByTestId, getByRole } = render(<App />)
  fireEvent.click(getByRole('button', { name: 'P w c2' }))
  fireEvent.click(getByTestId('c4'))
  expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1)
})

test('Should reset the board', async () => {
  const { getByTestId, getByRole, queryByRole } = render(<App />)
  fireEvent.click(getByRole('button', { name: 'P w c2' }))
  fireEvent.click(getByTestId('c4'))
  expect(getByRole('button', { name: 'P w c4' })).toBeDefined()
  expect(queryByRole('button', { name: 'P w c2' })).toBeNull()
  fireEvent.click(getByRole('button', { name: 'reset' }))
  expect(getByRole('button', { name: 'P w c2' })).toBeDefined()
})

test('Should deselect a piece and select another one by clicking over it', async () => {
  const { getByTestId, getByRole, queryByRole } = render(
    <App FEN="8/2p5/8/8/8/8/2PP4/8 w KQkq - 0 1" />
  )
  fireEvent.click(getByRole('button', { name: 'P w c2' }))
  fireEvent.click(getByRole('button', { name: 'P w d2' }))
  fireEvent.click(getByTestId('d4'))

  expect(getByRole('button', { name: 'P w c2' })).toBeDefined()
  expect(getByRole('button', { name: 'P w d4' })).toBeDefined()
  expect(queryByRole('button', { name: 'P w d2' })).toBeNull()
})

test('Should capture a pawn', async () => {
  const { getByTestId, getByRole, queryByRole } = render(
    <App FEN="8/2p5/8/8/8/8/1P6/8 b KQkq - 0 1" />
  )
  fireEvent.click(getByRole('button', { name: 'P b c7' }))
  fireEvent.click(getByTestId('c5'))
  fireEvent.click(getByRole('button', { name: 'P w b2' }))
  fireEvent.click(getByTestId('b4'))

  fireEvent.click(getByRole('button', { name: 'P b c5' }))
  fireEvent.click(getByRole('button', { name: 'P w b4' }))

  expect(getByRole('button', { name: 'P b b4' })).toBeDefined()
  expect(queryByRole('button', { name: 'P w b4' })).toBeNull()
})

// test('Should undo a move', async () => {
//   const { getByTestId, getByRole, queryByRole } = render(<App />)
//   fireEvent.click(getByRole('button', { name: 'P b c2' }))
//   fireEvent.click(getByTestId('c4'))
//   expect(getByRole('button', { name: 'P b c4' })).toBeDefined()
//   expect(queryByRole('button', { name: 'P b c2' })).toBeNull()

//   fireEvent.click(getByRole('button', { name: '<' }))
//   expect(getByRole('button', { name: 'P b c2' })).toBeDefined()
//   expect(queryByRole('button', { name: 'P b c4' })).toBeNull()
// })

// test('Should not redo if at the end of the history stack', async () => {
//   const { getByRole } = render(<App />)
//   fireEvent.click(getByRole('button', { name: '>' }))
//   expect(getByRole('button', { name: 'P b c2' })).toBeDefined()
// })

// test('Should redo several moves', async () => {
//   const { getByTestId, getByRole, queryByRole } = render(<App />)
//   fireEvent.click(getByRole('button', { name: 'P b c2' }))
//   fireEvent.click(getByTestId('c4'))
//   fireEvent.click(getByRole('button', { name: 'P b c4' }))
//   fireEvent.click(getByTestId('c5'))
//   fireEvent.click(getByRole('button', { name: 'P b c5' }))
//   fireEvent.click(getByTestId('c6'))

//   expect(getByRole('button', { name: 'P b c6' })).toBeDefined()
//   expect(queryByRole('button', { name: 'P b c2' })).toBeNull()

//   fireEvent.click(getByRole('button', { name: '<' }))
//   fireEvent.click(getByRole('button', { name: '<' }))
//   fireEvent.click(getByRole('button', { name: '<' }))
//   fireEvent.click(getByRole('button', { name: '<' }))
//   fireEvent.click(getByRole('button', { name: '<' }))
//   fireEvent.click(getByRole('button', { name: '<' }))

//   expect(getByRole('button', { name: 'P b c2' })).toBeDefined()
//   expect(queryByRole('button', { name: 'P b c6' })).toBeNull()

//   fireEvent.click(getByRole('button', { name: '>' }))
//   fireEvent.click(getByRole('button', { name: '>' }))
//   fireEvent.click(getByRole('button', { name: '>' }))
//   fireEvent.click(getByRole('button', { name: '>' }))
//   fireEvent.click(getByRole('button', { name: '>' }))
//   fireEvent.click(getByRole('button', { name: '>' }))

//   expect(getByRole('button', { name: 'P b c6' })).toBeDefined()
//   expect(queryByRole('button', { name: 'P b c2' })).toBeNull()
// })

// test('Should write new history after going back', async () => {
//   const { getByTestId, getByRole, queryByRole } = render(<App />)
//   fireEvent.click(getByRole('button', { name: 'P b c2' }))
//   fireEvent.click(getByTestId('c4'))
//   fireEvent.click(getByRole('button', { name: '<' }))
//   fireEvent.click(getByTestId('c3'))

//   expect(getByRole('button', { name: 'P b c3' })).toBeDefined()
//   expect(queryByRole('button', { name: 'P b c2' })).toBeNull()
//   expect(queryByRole('button', { name: 'P b c4' })).toBeNull()
// })
