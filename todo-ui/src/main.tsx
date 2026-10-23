import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { HashRouter, Routes, Route, Link, useParams, useLocation } from 'react-router';
import TodoList from '@/components/TodoList';

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
        console.log('Got response', response.data);
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
      {todoLists.map((todoList) => (
        <div key={todoList.id}>
          {todoList.title}{' '}
          <Link to={`/todo/${todoList.id}`}>View {todoList.title}</Link>
        </div>
      ))}
    </div>
  );
}

function TodoListRoute() {
  const { id } = useParams<{ id: string }>();
  return <TodoList id={id ?? ''} />;
}

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo/:id" element={<TodoListRoute />} />
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
