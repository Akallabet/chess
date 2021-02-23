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

test('Should create an unambiguous move by specifiyng the name', () => {
  const { getByTestId, getByRole, queryByRole } = render(
    <App FEN="r1bqkb1r/ppp1pppp/2n2n2/3p4/4P3/8/PPPPNPPP/RNBQKB1R w KQkq - 0 1" />
  )
  fireEvent.click(getByRole('button', { name: 'P w c2' }))
  fireEvent.click(getByTestId('c3'))
  expect(getByRole('button', { name: 'P w c3' })).toBeDefined()
  expect(queryByRole('button', { name: 'P w c2' })).toBeNull()
})

test('Should create an unambiguous move by specifiyng the file', () => {
  const { getByTestId, getByRole, queryByRole } = render(
    <App FEN="r1bqkb1r/ppp1pppp/2n2n2/3p4/4P3/8/PPPPNPPP/RNBQKB1R w KQkq - 0 1" />
  )
  fireEvent.click(getByRole('button', { name: 'N w b1' }))
  fireEvent.click(getByTestId('c3'))
  expect(getByRole('button', { name: 'N w c3' })).toBeDefined()
  expect(queryByRole('button', { name: 'N w b1' })).toBeNull()
})

test('Should create an unambiguous move by specifiyng the file and the rank', () => {
  const { getByTestId, getByRole, queryByRole } = render(
    <App FEN="r1bqkb1r/ppp1pp1p/2n3p1/1N5n/2PpP3/8/PP1P1PPP/RNBQKB1R w KQkq - 0 1" />
  )
  fireEvent.click(getByRole('button', { name: 'N w b1' }))
  fireEvent.click(getByTestId('c3'))
  expect(getByRole('button', { name: 'N w c3' })).toBeDefined()
  expect(queryByRole('button', { name: 'N w b1' })).toBeNull()
})

test('Should display which color has to move', () => {
  const { getByTestId, getByRole, getByText } = render(<App />)
  expect(getByText('White to move')).toBeDefined()
  fireEvent.click(getByRole('button', { name: 'P w c2' }))
  fireEvent.click(getByTestId('c4'))
  expect(getByRole('button', { name: 'P w c4' })).toBeDefined()
  expect(getByText('Black to move')).toBeDefined()
})

test('it should castle the white king on the king side', () => {
  const { getByTestId, getByRole, queryByRole } = render(
    <App FEN="r3k2r/8/8/8/8/8/8/R3K2R_w_KQkq_-_0_1" />
  )
  fireEvent.click(getByRole('button', { name: 'K w e1' }))
  fireEvent.click(getByTestId('g1'))
  expect(getByRole('button', { name: 'K w g1' })).toBeDefined()
  expect(getByRole('button', { name: 'R w f1' })).toBeDefined()
  expect(queryByRole('button', { name: 'R w h1' })).toBeNull()
})

test('it should disable castling if king moves', () => {
  const { getByTestId, getByRole, queryByRole } = render(
    <App FEN="rnbqkbnr/pppppppp/8/8/8/8/8/R3K2R_w_KQkq_-_0_1" />
  )
  fireEvent.click(getByRole('button', { name: 'K w e1' }))
  fireEvent.click(getByTestId('f1'))
  fireEvent.click(getByRole('button', { name: 'P b c7' }))
  fireEvent.click(getByTestId('c6'))
  fireEvent.click(getByRole('button', { name: 'K w f1' }))
  fireEvent.click(getByTestId('e1'))
  fireEvent.click(getByRole('button', { name: 'P b c6' }))
  fireEvent.click(getByTestId('c5'))
  fireEvent.click(getByRole('button', { name: 'K w e1' }))
  fireEvent.click(getByTestId('g1'))
  expect(queryByRole('button', { name: 'K w g1' })).toBeNull()
  expect(getByRole('button', { name: 'R w h1' })).toBeDefined()
  expect(queryByRole('button', { name: 'R w f1' })).toBeNull()
})

test('it should disable kingside castling if kigside rook moves', () => {
  const { getByTestId, getByRole, queryByRole } = render(
    <App FEN="rnbqkbnr/pppppppp/8/8/8/8/8/R3K2R_w_KQkq_-_0_1" />
  )
  fireEvent.click(getByRole('button', { name: 'R w h1' }))
  fireEvent.click(getByTestId('g1'))
  fireEvent.click(getByRole('button', { name: 'P b c7' }))
  fireEvent.click(getByTestId('c6'))
  fireEvent.click(getByRole('button', { name: 'R w g1' }))
  fireEvent.click(getByTestId('h1'))
  fireEvent.click(getByRole('button', { name: 'P b c6' }))
  fireEvent.click(getByTestId('c5'))
  fireEvent.click(getByRole('button', { name: 'K w e1' }))
  fireEvent.click(getByTestId('g1'))
  expect(queryByRole('button', { name: 'K w g1' })).toBeNull()
  expect(getByRole('button', { name: 'R w h1' })).toBeDefined()
  expect(queryByRole('button', { name: 'R w f1' })).toBeNull()
})

test('it should disable queenside castling if queenside rook moves', () => {
  const { getByTestId, getByRole, queryByRole } = render(
    <App FEN="rnbqkbnr/pppppppp/8/8/8/8/8/R3K2R_w_KQkq_-_0_1" />
  )
  fireEvent.click(getByRole('button', { name: 'R w a1' }))
  fireEvent.click(getByTestId('b1'))
  fireEvent.click(getByRole('button', { name: 'P b c7' }))
  fireEvent.click(getByTestId('c6'))
  fireEvent.click(getByRole('button', { name: 'R w b1' }))
  fireEvent.click(getByTestId('a1'))
  fireEvent.click(getByRole('button', { name: 'P b c6' }))
  fireEvent.click(getByTestId('c5'))
  fireEvent.click(getByRole('button', { name: 'K w e1' }))
  fireEvent.click(getByTestId('c1'))
  expect(queryByRole('button', { name: 'K w c1' })).toBeNull()
  expect(getByRole('button', { name: 'R w a1' })).toBeDefined()
  expect(queryByRole('button', { name: 'R w d1' })).toBeNull()
})

test('it should capture a pawn as en-passant', () => {
  const { getByTestId, getByRole, queryByRole } = render(
    <App FEN="rnbqkbnr/ppp1pppp/8/8/3p4/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" />
  )
  fireEvent.click(getByRole('button', { name: 'P w c2' }))
  fireEvent.click(getByTestId('c4'))
  fireEvent.click(getByRole('button', { name: 'P b d4' }))
  fireEvent.click(getByTestId('c3'))
  expect(getByRole('button', { name: 'P b c3' })).toBeDefined()
  expect(queryByRole('button', { name: 'P w c4' })).toBeNull()
  expect(queryByRole('button', { name: 'P b c5' })).toBeNull()
})
