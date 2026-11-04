import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { HashRouter, Routes, Route, Link, useParams } from 'react-router';
import TodoList from '@/components/TodoList';
import CreateTodoList from '@/components/CreateTodoList';
import RouteDisplay from './components/RouteDisplay';

interface TodoListSummary {
  id: string;
  title: string;
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
        <Link className="btn-primary" to="/create-todo-list">
          Create New Todo List
        </Link>
      </div>
      {todoLists.map((todoList) => (
        <div key={todoList.id}>
          <Link to={`/todo/${todoList.id}`}>{todoList.title}</Link>
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
