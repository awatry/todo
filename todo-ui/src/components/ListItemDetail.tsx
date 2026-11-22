import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';

// --- Type Definitions ---

export interface ListItem {
  id: string;
  title: string;
  position: number;
  type: 'SECTION' | 'LIST_ITEM';
  itemText?: string;
  complete?: boolean;
  parentId?: number | null;
  todoListId: number;
  parentTitle?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
  subItems?: ListItem[];
}

// --- Props ---
interface TodoListProps {
  id: string; //Todo List ID
  itemId: string; //List Item ID
}

const ListItemDetail = (props: TodoListProps) => {
  const [listItem, setListItem] = useState<ListItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListItem = async () => {
      if (!props.itemId) return;
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<ListItem>(`/api/list-items/${props.itemId}`);
        setListItem(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListItem();
  }, [props.itemId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!listItem) return <p>No list item found.</p>;

  const renderSubItems = (items: ListItem[], depth: number) => {
    return (
      <ul style={{ paddingLeft: `${depth * 20}px`, listStyle: 'none' }}>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: '10px' }}>
            {item.type === 'SECTION' ? (
              <h3 className="section-title">{item.title}</h3>
            ) : (
              <div className="todo-item-content">
                <input type="checkbox" checked={item.complete ?? false} readOnly />
                <span className="todo-title">{item.title}</span>
                {item.itemText && <p className="item-text">{item.itemText}</p>}
              </div>
            )}
            {item.subItems && item.subItems.length > 0 && renderSubItems(item.subItems, depth + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="p-4">
      {/* <RouteDisplay /> */}
      <div className="mb-4">
        {listItem.parentId ? (
          <Link to={`/todo/${listItem.todoListId}`} className="text-blue-600 hover:underline">
            ← Back to Todo List ({listItem.parentTitle})
          </Link>
        ) : (
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to All Lists
          </Link>
        )}
      </div>

      <div className="border p-6 rounded-lg bg-card">
        <h1 className="text-2xl font-bold mb-4">
          {listItem.type === 'SECTION' ? 'Section' : 'List Item'}: {listItem.title}
        </h1>
        <div className="space-y-2">
          {listItem.type !== 'SECTION' && listItem.complete !== undefined && (
            <p>
              <strong>Complete:</strong> {listItem.complete}
            </p>
          )}
          {listItem.itemText && (
            <p>
              <strong>Text:</strong> {listItem.itemText}
            </p>
          )}
          <p>
            <strong>Parent ID:</strong> {listItem.parentId ?? 'None'}
          </p>
          <p>
            <strong>Todo List ID:</strong> {listItem.todoListId}
          </p>
          <p>
            <strong>Created At:</strong> {listItem.createdAt}
          </p>
          <p>
            <strong>Updated At:</strong> {listItem.updatedAt}
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Sub-items</h2>
          {listItem.subItems && listItem.subItems.length > 0 ? (
            renderSubItems(listItem.subItems, 0)
          ) : (
            <p className="text-gray-500">No sub-items.</p>
          )}
        </div>
      </div>

      <style>{`
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
          color: var(--text);
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default ListItemDetail;
