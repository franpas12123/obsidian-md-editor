export const addMarkdown = (text, prefix, suffix, selectionStart, selectionEnd) => {
  const selected = text.substring(selectionStart, selectionEnd)
  const before = text.substring(0, selectionStart)
  const after = text.substring(selectionEnd)

  const newText = before + prefix + selected + suffix + after
  const newCursorPos = selectionStart + prefix.length + selected.length + suffix.length
  return { newText, newCursorPos }
}
