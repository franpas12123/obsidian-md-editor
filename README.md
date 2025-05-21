# 📝 Vue Markdown Editor

A lightweight, Obsidian-inspired Markdown editor with a live preview, syntax highlighting via Prism, and custom checklist rendering. Built using **Vue 3**, **Vite**, and **Marked**.

---

## 🚀 Features

- Rich Markdown editing with toolbar buttons
- Live preview with syntax highlighting
- Code blocks with language support (JS, CSS, HTML)
- Interactive toolbar buttons (bold, italic, headings, code, lists, etc.)
- Checklist rendering (disabled in preview mode)
- Responsive layout for mobile and desktop
- Clean, dark-themed UI

---

## 🛠️ Tech Stack

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Marked](https://marked.js.org/) – Markdown parser
- [PrismJS](https://prismjs.com/) – Syntax highlighting
- [Vitest](https://vitest.dev/) – Unit testing

---

## 📦 Installation

```bash
git clone https://github.com/your-username/vue-markdown-editor.git
cd vue-markdown-editor
npm install
```

---

## 🧪 Running Tests

This project uses Vitest for unit and component testing.

```
# Run all tests
npx vitest run

# Run tests in watch mode
npx vitest
```

Make sure test files follow the .spec.js or .test.js naming convention.

---

## 🧑‍💻 Development

To start the dev server:

```
npm run dev
```

Then open your browser at http://localhost:5173.

---

## ✅ To Do

- ✅ Add checklist support
- ✅ Add toolbar buttons for formatting
- ✅ Add syntax highlighting
- Make checklists editable in preview
- Add export to Markdown/HTML
- Add drag-and-drop image support
