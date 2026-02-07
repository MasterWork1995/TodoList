# Todo List

Responsive todo list application (React 19, TypeScript, Vite). Kanban-style board with columns, drag-and-drop, search and filters.

## Features

- Add and remove tasks and columns
- Drag tasks between columns and reorder within a column
- Drag columns to reorder
- Mark tasks complete or active
- Multi-select: delete, mark complete, mark active, move to column
- Search by name (exact and fuzzy), highlight matches
- Filter: all / active / completed
- Edit task text
- Persist state in localStorage

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Demo

Add a link to the live deployment here.

## Stack

- React 19, TypeScript
- Vite 7
- Tailwind CSS v4
- Framer Motion, Font Awesome, react-select
- @atlaskit/pragmatic-drag-and-drop (no full UI libraries)

## Structure

- `src/components` — UI (Column, TaskItem, TaskList, SearchBar, FilterBar, BulkActionsBar)
- `src/ui` — custom Input, Checkbox, Button
- `src/hooks` — useAppState, useSearch, useSelection, useTodoBoard
- `src/types` — Task, Column, AppState, TaskFilter
- `src/utils` — storage, search (fuzzy + highlight), id
