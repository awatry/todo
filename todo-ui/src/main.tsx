import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { HashRouter, Routes, Route, Link, useParams, useLocation } from 'react-router';
import TodoList from '@/components/TodoList';
import CreateTodoList from '@/components/CreateTodoList';

interface TodoListSummary {
  id: string;
  title: string;
}

function RouteDisplay() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);

  // Determine the parent route
  let parentPath = '/';
  if (pathParts.length > 0) {
    // If it's a 'todo/:id' route, the parent is '/'
    if (pathParts[0] === 'todo') {
      parentPath = '/';
    } else {
      // For other routes, we go one level up
      const parentParts = pathParts.slice(0, -1);
      parentPath = '/' + parentParts.join('/');
    }
  }

  return (
    <p>
      <strong className="font-bold">Current route path:</strong> {location.pathname}{' '}
      <Link to={parentPath}>Go back</Link>
    </p>
  );
}

function Home() {
  const [todoLists, setTodoLists] = useState<TodoListSummary[]>([]);

  useEffect(() => {
    axios
      .get('/api/todo-lists')
      .then((response) => {
        setTodoLists(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <RouteDisplay />
      <div style={{ marginBottom: '20px' }}>
        <Link to="/create-todo-list">Create New Todo List</Link>
      </div>
      {todoLists.map((todoList) => (
        <div key={todoList.id}>
          {todoList.title} <Link to={`/todo/${todoList.id}`}>View {todoList.title}</Link>
        </div>
      ))}
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

function App() {
  return (
    <div>
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
