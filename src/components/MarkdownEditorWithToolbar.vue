<template>
  <div>
    <div class="toolbar">
      <button @click="addMarkdown('**', '**')"><b>B</b></button>
      <button @click="addMarkdown('_', '_')"><i>I</i></button>
      <button @click="addMarkdown('# ', '')">H1</button>
      <button @click="addMarkdown('## ', '')">H2</button>
      <button @click="addMarkdown('`', '`')">Code</button>
      <button @click="addCodeBlock()">Code Block</button>
      <button @click="addLink()">Link</button>
      <button @click="addImage()">Image</button>
      <button @click="addList()">List</button>
      <button @click="addChecklist()">Checklist</button>
      <button @click="addQuote()">Quote</button>
      <button @click="addHR()">HR</button>
    </div>

    <div class="editor-container">
      <textarea ref="textarea" v-model="markdown" class="editor"></textarea>
      <div class="preview" ref="preview" v-html="compiledMarkdown"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { marked, Renderer } from 'marked'

import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'

const markdown = ref(`# Welcome to your Obsidian-like editor

## Examples

### Code block

\`\`\`js
function greet(name) {
  console.log('Hello, ' + name + '!');
}
greet('Vue');
\`\`\`

### Checklist

- [x] Write the editor
- [ ] Add toolbar buttons
- [ ] Support tabs and indents

### Table

| Feature       | Status    |
| ------------- | --------- |
| Markdown      | ✅ Done   |
| Live Preview  | ✅ Done   |
| Toolbar       | In Progress |

### Blockquote

> This is a blockquote.
> It can span multiple lines.

### Tabs (simulate with code block)

\`\`\`plaintext
Tab 1 content here
Tab 2 content here
Tab 3 content here
\`\`\`

---

Feel free to edit this text and see live preview!
`)

const preview = ref(null)

let taskIndex = 0
const renderer = new marked.Renderer()
renderer.listitem = (text, task, checked) => {
  if (task) {
    const html = `
      <li class="task-item">
        <label>
          <input type="checkbox" data-task-index="${taskIndex}" ${
      checked ? 'checked' : ''
    } />
          ${text}
        </label>
      </li>
    `
    taskIndex++
    return html
  }
  return `<li>${text}</li>`
}

const compiledMarkdown = computed(() => {
  taskIndex = 0
  return marked.parse(markdown.value, { renderer })
})

const onPreviewClick = (event) => {
  const el = event.target
  if (
    el.tagName === 'INPUT' &&
    el.type === 'checkbox' &&
    el.dataset.taskIndex !== undefined
  ) {
    const index = Number(el.dataset.taskIndex)
    const checked = el.checked

    updateMarkdownChecklist(index, checked)
  }
}

const updateMarkdownChecklist = (index, checked) => {
  const lines = markdown.value.split('\n')
  let taskCount = -1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const match = line.match(/^(\s*[-*+] )\[( |x|X)\](.*)$/)
    if (match) {
      taskCount++
      if (taskCount === index) {
        const status = checked ? 'x' : ' '
        lines[i] = `${match[1]}[${status}]${match[3]}`
        break
      }
    }
  }

  markdown.value = lines.join('\n')
}

onMounted(() => {
  if (preview.value) {
    preview.value.addEventListener('click', onPreviewClick)
  }
  Prism.highlightAllUnder(preview.value)
})

watch(preview, (newEl, oldEl) => {
  if (oldEl) oldEl.removeEventListener('click', onPreviewClick)
  if (newEl) newEl.addEventListener('click', onPreviewClick)
})

// marked.use({
//   walkTokens(token) {
//     if (token.type === 'list' && token.items) {
//       for (const item of token.items) {
//         if (item.task) {
//           item.text = `<label class="checkbox-label">
//             <input type="checkbox" ${
//               item.checked ? 'checked' : ''
//             } onclick="this.checked=!this.checked;">
//             ${item.text}
//           </label>`
//         }
//       }
//     }
//   }
// })

marked.setOptions({
  highlight(code, lang) {
    if (Prism.languages[lang]) {
      return Prism.highlight(code, Prism.languages[lang], lang)
    }
    return code
  },
  renderer
})

onMounted(() => {
  Prism.highlightAllUnder(preview.value)
})

watch(markdown, async () => {
  await nextTick()
  Prism.highlightAllUnder(preview.value)
})

const textarea = ref(null)

const addMarkdown = (prefix, suffix) => {
  const el = textarea.value
  const start = el.selectionStart
  const end = el.selectionEnd
  const selected = markdown.value.substring(start, end)
  const before = markdown.value.substring(0, start)
  const after = markdown.value.substring(end)

  markdown.value = before + prefix + selected + suffix + after

  const pos = start + prefix.length + selected.length + suffix.length
  nextTick(() => {
    el.focus()
    el.setSelectionRange(pos, pos)
  })
}

const addCodeBlock = () => {
  const el = textarea.value
  const start = el.selectionStart
  const end = el.selectionEnd
  const selected = markdown.value.substring(start, end)
  const before = markdown.value.substring(0, start)
  const after = markdown.value.substring(end)

  const newText = `\`\`\`js\n${selected || '// your code here'}\n\`\`\`\n`
  markdown.value = before + newText + after

  const pos = before.length + newText.length
  nextTick(() => {
    el.focus()
    el.setSelectionRange(pos, pos)
  })
}

const addLink = () => addMarkdown('[', '](https://example.com)')

const addImage = () => addMarkdown('![', '](https://via.placeholder.com/150)')

const addList = () => addMarkdown('- ', '')

const addChecklist = () => addMarkdown('- [ ] ', '')

const addQuote = () => addMarkdown('> ', '')

const addHR = () => addMarkdown('\n---\n', '')
</script>

<style scoped>
/* Container for editor and preview */
.editor-container {
  display: flex;
  height: 90vh;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  background-color: #121212;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Textarea editor */
.editor {
  flex: 1;
  padding: 1rem;
  font-family: 'Fira Mono', 'Source Code Pro', monospace;
  font-size: 16px;
  line-height: 1.5;
  color: #ddd;
  background-color: #1e1e1e;
  border: none;
  outline: none;
  resize: none;
  border-right: 1px solid #3a3a3a;
  overflow-y: auto;
}

/* Custom scrollbar for editor */
.editor::-webkit-scrollbar {
  width: 10px;
}
.editor::-webkit-scrollbar-track {
  background: #2e2e2e;
}
.editor::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 5px;
  border: 2px solid #2e2e2e;
}

/* Preview panel */
.preview {
  flex: 1;
  padding: 1.2rem 1.5rem;
  color: #ddd;
  background-color: #181818;
  overflow-y: auto;
  font-size: 16px;
  line-height: 1.6;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  scrollbar-width: thin;
  scrollbar-color: #555 #2e2e2e;
}

/* Custom scrollbar for preview */
.preview::-webkit-scrollbar {
  width: 10px;
}
.preview::-webkit-scrollbar-track {
  background: #2e2e2e;
}
.preview::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 5px;
  border: 2px solid #2e2e2e;
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: 0.6em;
  padding: 0.5rem 1rem;
  background-color: #1f1f1f;
  border-bottom: 1px solid #3a3a3a;
  user-select: none;
}
.toolbar button {
  background-color: transparent;
  border: 1.5px solid transparent;
  border-radius: 4px;
  color: #ddd;
  font-weight: 700;
  padding: 0.25em 0.6em;
  cursor: pointer;
  transition: all 0.2s ease;
}
.toolbar button:hover {
  background-color: #3a3a3a;
  border-color: #666;
}

/* Markdown element styling */

/* Headings */
.preview h1,
.preview h2,
.preview h3,
.preview h4,
.preview h5,
.preview h6 {
  color: #eee;
  margin-top: 1.2em;
  margin-bottom: 0.4em;
  font-weight: 600;
  border-bottom: 1px solid #333;
  padding-bottom: 0.2em;
}

/* Links */
.preview a {
  color: #82aaff;
  text-decoration: none;
  border-bottom: 1px solid #82aaff;
  transition: color 0.2s ease;
}
.preview a:hover {
  color: #aabbff;
  border-bottom-color: #aabbff;
}

/* Inline code */
.preview code {
  background-color: #2d2d2d;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: 'Fira Mono', monospace;
  font-size: 0.95em;
  color: #f6f8fa;
}

/* Code blocks */
.preview pre {
  background-color: #2d2d2d;
  color: #f6f8fa;
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1em 0;
  font-family: 'Fira Mono', monospace;
  font-size: 0.9em;
  line-height: 1.4;
}

/* Blockquotes */
.preview blockquote {
  border-left: 4px solid #555;
  padding-left: 1em;
  color: #bbb;
  margin: 1em 0;
  font-style: italic;
  background-color: #222;
  border-radius: 4px;
}

/* Lists */
.preview ul,
.preview ol {
  padding-left: 1.2em;
  margin: 0.8em 0;
}

/* Checklist */
.preview input[type='checkbox'] {
  transform: scale(1.3);
  margin-right: 0.5em;
  vertical-align: middle;
  cursor: pointer;
}

/* Tables */
.preview table {
  border-collapse: collapse;
  width: 100%;
  margin: 1.2em 0;
  border-radius: 6px;
  overflow: hidden;
}
.preview th,
.preview td {
  border: 1px solid #444;
  padding: 0.6em 1em;
  text-align: left;
  background-color: #1e1e1e;
}
.preview th {
  background-color: #292929;
  font-weight: 600;
}

/* Horizontal rule */
.preview hr {
  border: 0;
  border-top: 1px solid #333;
  margin: 1.5em 0;
}

/* Paragraphs */
.preview p {
  margin: 0.6em 0;
}
.preview .task-list-item {
  list-style: none;
  display: flex;
  align-items: center;
  margin-bottom: 0.4em;
}
.preview input[type='checkbox'] {
  transform: scale(1.3);
  margin-right: 0.5em;
  vertical-align: middle;
  cursor: pointer;
}

/* Responsive: stack editor and preview vertically on small screens */
@media (max-width: 768px) {
  .editor-container {
    flex-direction: column;
    height: auto;
  }
  .editor,
  .preview {
    height: 40vh;
    border-right: none;
    border-bottom: 1px solid #3a3a3a;
  }
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5em;
  cursor: pointer;
}

.preview input[type='checkbox'] {
  transform: scale(1.2);
  cursor: pointer;
}
.task-item {
  list-style: none;
  margin: 0.5em 0;
}

.task-item input[type='checkbox'] {
  transform: scale(1.2);
  margin-right: 0.6em;
  cursor: not-allowed;
}
</style>
