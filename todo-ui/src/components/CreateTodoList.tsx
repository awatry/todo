import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

interface TodoListSummary {
  id: string;
  title: string;
  position: number;
}

const CreateTodoList = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [position, setPosition] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch current positions to determine the next one
    axios
      .get<TodoListSummary[]>('/api/todo-lists')
      .then((response) => {
        const positions = response.data.map((l) => l.position);
        if (positions.length > 0) {
          setPosition(Math.max(...positions) + 1);
        }
      })
      .catch((err) => {
        console.error('Error fetching positions:', err);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/todo-lists', {
        title,
        position,
      });

      // The response includes the 'self' link or the object with the ID
      // Based on OpenAPI, it returns TodoListCollectionItem which has a 'self' property
      // or we can just use the ID from the response body if it's there.
      const newTodo = response.data;

      const id = (newTodo as any).id;
      if (id) {
        navigate(`/todo/${id}`);
      } else if (newTodo.self) {
        // Extract id from self URL if id is missing
        const parts = newTodo.self.split('/');
        const id = parts[parts.length - 1];
        navigate(`/todo/${id}`);
      }
    } catch (err) {
      console.error('Error creating todo list:', err);
      setError('Failed to create todo list.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="component-title">Create New Todo List</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="title" style={{ display: 'block' }}>
            Title:
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '300px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="position" style={{ display: 'block' }}>
            Position:
          </label>
          <input
            id="position"
            type="number"
            value={position}
            onChange={(e) => setPosition(parseInt(e.target.value) || 1)}
            required
            style={{ width: '100px' }}
          />
        </div>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Creating...' : 'Create Todo List'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => navigate('/')} style={{ marginTop: '20px' }} className="btn-cancel">
        Cancel
      </button>
    </div>
  );
};

export default CreateTodoList;
