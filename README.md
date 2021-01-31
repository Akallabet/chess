# CHESS

## [Live version](https://akallabet.github.io/chess/)

## [Code Sandbox](https://codesandbox.io/s/wonderful-lewin-geftn)

## Contents

1. [ Features ](#features)
2. [ Structure ](#structure)
3. [ Styling ](#styling)
4. [ Installation ](#installation)
5. [ Local Development ](#local-development)

## Features

- Display a chessboard with a default FEN of: 8/2p5/8/8/8/8/8/8 w KQkq - 0 1
- Display a button that adds a white pawn to a random legal position on the board
- Allow that pawn to make legal moves across the board.

Additional Features

- The white pawn button can add as many white pawns as there are free legal positions on the board
- Allow to select every piece on the board and to move it
- Add an undo "<" button
- Add a redo ">" button
- Add a reset button

## Structure

```
src/game
```

This is the js game logic which is indipendent from the UI, it exports a function that accepts an object with:

- FEN: (only with pawns) - String - Required
- board - Array
- activePiece - Object
- capturedPieces - Array

It returns a set of functions that, upon invocation, return the resulting status:

- FEN: new FEN configuration
- board: Array representation of a chessboard
- activePiece: current selected piece
- capturedPieces: Array of captured pieces

```
src/game/components
```

This folder contains a wrapper in React for using the game logic, the entry point would be `GameProvider`. By wrapping any React component with this provider, it allows to use the HOC `withGame` which exposes all the game pieces such as `board`, `activePiece` and so on

```
src/components
```

This is where all the React components live

```
src/i18n
```

This is where all the copy in json lives (only `gb_EN`), in order to access it, wrap the outmost component with `I18nProvider` and then use the HOC `withI18n` to access the copy

## Styling

All the are created using [Tailwindcss](https://tailwindcss.com/), I created two reusable react components that translate props to tailwindcss classes as an example:

- `Box`
- `Button`

## Installation

Prerequisites:

- Nodejs: this code has been run with Nodejs v14 with MacOS Catalina
- Git

Clone this repo either via https or ssh, then from a terminal cd into the repo folder and

```
npm i
```

## local-development

Launch the local dev server with hot reload (http://localhost:8000)

```
npm start
```

Launch the unit tests suite

```
npm test
```
