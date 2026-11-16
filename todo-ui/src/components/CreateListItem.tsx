import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

export type ListItemType = 'SECTION' | 'LIST_ITEM';

export interface ListItem {
  id?: number;
  title: string;
  position: number;
  type: ListItemType;
  itemText?: string;
  subItems?: ListItem[];
  complete?: boolean;
  parentId?: number | null;
  todoListId?: number;
}

interface CreateListItemProps {
  todoListId: number;
}

export default function CreateListItem({ todoListId }: CreateListItemProps) {
  const navigate = useNavigate();
  const [type, setType] = useState<ListItemType>('LIST_ITEM');
  const [title, setTitle] = useState('');
  const [itemText, setItemText] = useState('');
  const [position, setPosition] = useState('1');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const payload: ListItem = {
        title: title.trim(),
        type,
        position: Number(position),
        todoListId,
      };
      if (type === 'LIST_ITEM') {
        payload.itemText = itemText.trim();
      }
      await axios.post('/api/list-items', payload);
      navigate(`/todo/${todoListId}`);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(`Failed to create list item: ${err.response.data?.message ?? err.message}`);
      } else {
        setError(
          `Failed to create list item: ${err instanceof Error ? err.message : 'Unknown error'}`
        );
      }
    }
  };

  const handleCancel = () => {
    navigate(`/todo/${todoListId}`);
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="flex flex-col gap-4">
        <label className="label">
          Type
          <select
            className="input"
            value={type}
            onChange={(e) => setType(e.target.value as ListItemType)}
          >
            <option value="LIST_ITEM">List Item</option>
            <option value="SECTION">Section</option>
          </select>
        </label>

        <label className="label">
          Title
          <input
            type="text"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Section"
            required
          />
        </label>

        {type === 'LIST_ITEM' && (
          <label className="label">
            Item Text
            <input
              type="text"
              className="input"
              value={itemText}
              onChange={(e) => setItemText(e.target.value)}
              placeholder="Buy groceries"
            />
          </label>
        )}

        <label className="label">
          Position
          <input
            type="number"
            className="input"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
        </label>

        {error && <div className="error-text">{error}</div>}

        <div className="flex gap-2">
          <button type="submit" className="btn-primary">
            Create List Item
          </button>
          <button type="button" onClick={handleCancel} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
