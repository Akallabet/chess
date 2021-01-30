# CHESS

# [Live version](https://akallabet.github.io/chess/)

## Contents

1. [ Installation ](#installation)
2. [ Local Development ](#local-development)
3. [ Project Objectives ](#project-objectives)
4. [ Project Structure ](#project-structure)

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

## project-features

- Display a chessboard with a default FEN of: 8/2p5/8/8/8/8/8/8 w KQkq - 0 1
- Display a button that adds a white pawn to a random legal position on the board
- Allow that pawn to make legal moves across the board.

Additional Features

- The white pawn button can add as many white pawns as there are free legal positions on the board
- Allow to select every piece on the board and to move it
- Add an undo "<" button
- Add a redo ">" button
- Add a reset button

## project-structure

```
src/game
```

This is the js game logic which is indipendent from the UI, it exports a function that accepts an object with

- FEN: (only with pawns) - Required
- board: <Array>
- activePiece: <Object>
- capturedPieces: <Array>

It returns a set of functions that, upon invocation, return the resulting status:

- FEN: new FEN configuration,
- board: Array representation of a chessboard,
- activePiece: current selected piece,
- capturedPieces: Array of captured pieces,

```
src/game/components
```

This folder contains a wrapper in React for using the game logic

```
src/game/components/use-game.js
```

React hook that can be used in any react component

```
src/components
```

This is the collection of React components
