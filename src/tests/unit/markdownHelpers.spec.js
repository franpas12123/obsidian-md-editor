import { addMarkdown } from '../../src/utils/markdownHelpers'

describe('addMarkdown', () => {
  it('wraps selected text with prefix and suffix', () => {
    const text = 'Hello world'
    const selectionStart = 6
    const selectionEnd = 11
    const prefix = '**'
    const suffix = '**'

    const { newText, newCursorPos } = addMarkdown(
      text,
      prefix,
      suffix,
      selectionStart,
      selectionEnd
    )

    expect(newText).toBe('Hello **world**')
    expect(newCursorPos).toBe(6 + 2 + 5 + 2)
  })

  it('inserts prefix and suffix at cursor if no selection', () => {
    const text = 'Hello world'
    const selectionStart = 5
    const selectionEnd = 5
    const prefix = '_'
    const suffix = '_'

    const { newText, newCursorPos } = addMarkdown(
      text,
      prefix,
      suffix,
      selectionStart,
      selectionEnd
    )

    expect(newText).toBe('Hello__ world')
    expect(newCursorPos).toBe(6)
  })
})
