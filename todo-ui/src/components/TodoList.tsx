import { useEffect, useState } from 'react';
import axios from 'axios';

// --- Type Definitions ---

/** Represents a single task or section item in the todo list. */
export interface TodoItem {
  id: string;
  type: 'SECTION' | 'TODO';
  title: string;
  complete: boolean; /* Relevant for TODO items */
  itemText: string; /* Relevant for TODO items */
}

/** Represents the entire todo list structure. */
export interface TodoListData {
  id: string;
  title: string;
  topLevelItems: TodoItem[];
}

// --- Props ---
interface TodoListProps {
  id: string;
}

const TodoList = (props: TodoListProps) => {
  // --- Reactive State ---
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempTitle, setTempTitle] = useState<string>('');
  const [todoList, setTodoList] = useState<TodoListData | null>(null);

  // --- Lifecycle Hooks ---
  useEffect(() => {
    setTempTitle('');
    if (props.id) {
      // Fetch initial data using prop ID
      axios
        .get<TodoListData>(`/api/todo-lists/${props.id}`)
        .then((response) => {
          setTodoList(response.data);
        })
        .catch((error) => {
          if (error instanceof Error) {
            console.error('Error fetching todo list:', error);
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id]);

  // --- Methods ---
  const startEdit = () => {
    setIsEditing(true);
    if (todoList) {
      setTempTitle(todoList.title);
    }
  };

  const saveTitle = async () => {
    if (!todoList) return;

    // Optimistically update the local state
    const updatedList = { ...todoList, title: tempTitle };
    setTodoList(updatedList);

    try {
      // Attempt to update the backend
      await axios.put<TodoListData>(`/api/todo-lists/${props.id}`, updatedList);

      // Re-fetch or explicitly update local state to ensure consistency after API call
      const response = await axios.get<TodoListData>(`/api/todo-lists/${props.id}`);
      setTodoList(response.data);

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving todo list:', error);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    // Reset temp title to the current state of the todoList title
    if (todoList) {
      setTempTitle(todoList.title);
    }
  };

  // --- Render ---
  if (!todoList) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div>
        {!isEditing ? (
          <>
            <h1 className="component-title">{todoList.title} - Component</h1>
            <button onClick={startEdit}>Edit</button>
          </>
        ) : (
          <>
            <h1 className="component-title">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveTitle();
                }}
                onBlur={saveTitle}
              />{' '}
              - Component
            </h1>
            <button onClick={saveTitle}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </>
        )}
      </div>

      {todoList.topLevelItems && (
        <ul className="todo-list-items">
          {todoList.topLevelItems.map((topLevelItem) => (
            <li key={topLevelItem.id} className="todo-item">
              {topLevelItem.type === 'SECTION' ? (
                <h3 className="section-title">{topLevelItem.title}</h3>
              ) : (
                <div className="todo-item-content">
                  <input
                    type="checkbox"
                    checked={topLevelItem.complete}
                    onChange={(e) =>
                      setTodoList({
                        ...todoList,
                        topLevelItems: todoList.topLevelItems.map((item) =>
                          item.id === topLevelItem.id
                            ? { ...item, complete: e.target.checked }
                            : item
                        ),
                      })
                    }
                    className="todo-checkbox"
                  />
                  <span className="todo-title">{topLevelItem.title}</span>
                  <p className="item-text">{topLevelItem.itemText}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <style>{`
        .component-title {
          margin-bottom: 20px;
        }
        .todo-list-items {
          list-style: none;
          padding: 0;
        }
        .todo-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .section-title {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .todo-item-content {
          display: flex;
          align-items: center;
          width: 100%;
        }
        .todo-checkbox {
          margin-right: 10px;
        }
        .todo-title {
          flex-grow: 1;
        }
        .item-text {
          margin: 0;
          font-size: 0.9em;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default TodoList;
