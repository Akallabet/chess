import queryStringToObject from '.'

test.each`
  assertion                  | input                      | expected
  ${'one parameter'}         | ${'?tableId=10'}           | ${{tableId: '10'}}
  ${'two parameters'}        | ${'?tableId=10&env=test'}  | ${{tableId: '10', env: 'test'}}
  ${'repeated parameter'}    | ${'?id=10&id=11&env=test'} | ${{id: ['10', '11'], env: 'test'}}
  ${'empty parameter'}       | ${'test='}                 | ${{}}
  ${'no value'}              | ${'?test'}                 | ${{test: undefined}}
  ${'missing question mark'} | ${'a=1&b=2'}               | ${{a: '1', b: '2'}}
  ${'missing &'}             | ${'a=1b=2'}                | ${{a: '1b'}}
`('$assertion', ({input, expected}) => {
  expect(queryStringToObject(input)).toEqual(expected)
})
