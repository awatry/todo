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

function Home() {
  const location = useLocation();
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
      <p>
        <strong className="font-bold">Current route path:</strong> {location.pathname}{' '}
        <Link to="/">Go back</Link>
      </p>
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
  return <TodoList id={id ?? ''} />;
}

function CreateTodoListRoute() {
  return <CreateTodoList />;
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
