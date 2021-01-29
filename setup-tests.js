Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(() => null),
  },
  writable: true,
})

HTMLMediaElement.prototype.load = () => {
  /* do nothing */
}
HTMLMediaElement.prototype.play = jest.fn(() => {})
HTMLMediaElement.prototype.pause = () => {
  /* do nothing */
}
HTMLMediaElement.prototype.addTextTrack = () => {
  /* do nothing */
}

afterEach(() => {
  HTMLMediaElement.prototype.play.mockClear()
})
