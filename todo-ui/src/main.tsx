import SortableListItem from '@/components/SortableListItem';

import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { HashRouter, Routes, Route, Link, useParams } from 'react-router';
import TodoList from '@/components/TodoList';
import CreateTodoList from '@/components/CreateTodoList';
import RouteDisplay from './components/RouteDisplay';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface TodoListSummary {
  id: string;
  title: string;
  position: number;
}

function Home() {
  const [todoLists, setTodoLists] = useState<TodoListSummary[]>([]);

  useEffect(() => {
    axios
      .get<TodoListSummary[]>('/api/todo-lists')
      .then((response) => {
        const sorted = response.data.sort((a, b) => a.position - b.position);
        setTodoLists(sorted);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = todoLists.findIndex((item) => item.id === active.id);
      const overIndex = todoLists.findIndex((item) => item.id === over.id);

      if (activeIndex !== overIndex) {
        const newOrderedLists = arrayMove(todoLists, activeIndex, overIndex);
        setTodoLists(newOrderedLists);

        // Update positions in backend
        const updates = newOrderedLists.map((list, index) => ({
          id: list.id,
          position: index + 1,
          title: list.title,
        }));

        try {
          const promises = updates.map((update) =>
            axios.put(`/api/todo-lists/${update.id}`, {
              position: update.position,
              title: update.title,
              id: update.id,
            })
          );
          await Promise.all(promises);
        } catch (error) {
          console.error('Error updating positions:', error);
        }
      }
    }
  };

  return (
    <div className="p-4">
      <RouteDisplay />
      <div style={{ marginBottom: '20px' }}>
        <Link className="btn-primary" to="/create-todo-list">
          Create New Todo List
        </Link>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={todoLists.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {todoLists.map((todoList) => (
              <SortableListItem key={todoList.id} id={todoList.id} title={todoList.title} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function TodoListRoute() {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <RouteDisplay />
      <TodoList id={id ?? ''} />
    </div>
  );
}

function CreateTodoListRoute() {
  return (
    <div>
      <RouteDisplay />
      <CreateTodoList />
    </div>
  );
}

function getEffectiveTheme(themeName: string): string {
  switch (themeName) {
    case 'light':
      return 'light';
    case 'dark':
      return 'dark';
    case 'auto':
    default:
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}

function getNextTheme(themeName: string): string {
  switch (themeName) {
    case 'dark':
      return 'auto';
    case 'light':
      return 'dark';
    default:
      return 'light';
  }
}

function getNextThemeLabel(nextName: string): string {
  return `Switch to ${nextName} mode`;
}

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme && savedTheme !== 'auto') {
        return savedTheme;
      }
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemPrefersDark ? 'dark' : 'light';
    }
  });

  // Watch theme changes to sync with HTML tag and localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    const effectiveTheme = getEffectiveTheme(String(theme));
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', String(theme));
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => getNextTheme(String(prev)));
  };

  const themeName = typeof theme === 'string' ? theme : 'auto';
  const nextTheme = getNextTheme(themeName);
  const nextThemeLabel = getNextThemeLabel(nextTheme);

  return (
    <div className={`min-h-screen ${themeName} bg-background text-text`}>
      <nav className="p-4 border-b border-border">
        <span>Current theme: {themeName}</span>
        <button onClick={toggleTheme} className="btn-primary" style={{ marginBottom: '10px' }}>
          {nextThemeLabel}
        </button>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo/:id" element={<TodoListRoute />} />
        <Route path="/create-todo-list" element={<CreateTodoListRoute />} />
      </Routes>
    </div>
  );
}

const container = document.getElementById('app');
if (container) {
  createRoot(container).render(
    <HashRouter>
      <App />
    </HashRouter>
  );
}
