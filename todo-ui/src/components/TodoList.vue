<template>
  <div v-if="todoList">
    <div v-if="!isEditing">
      <h1 class="component-title">{{ todoList.title }} - Component</h1>
      <button @click="startEdit">Edit</button>
    </div>
    <div v-else>
      <h1 class="component-title">
        <input type="text" v-model="tempTitle" @keyup.enter="saveTitle" @blur="saveTitle" /> - Component
      </h1>
      <button @click="saveTitle">Save</button>
      <button @click="cancelEdit">Cancel</button>
    </div>

    <ul v-if="todoList.topLevelItems" class="todo-list-items">
      <li v-for="topLevelItem in todoList.topLevelItems" :key="topLevelItem.id" class="todo-item">
        <template v-if="topLevelItem.type === 'SECTION'">
          <h3 class="section-title">{{ topLevelItem.title }}</h3>
        </template>
        <template v-else class="todo-item-content">
          <input type="checkbox" v-model="topLevelItem.complete" class="todo-checkbox">
          <span class="todo-title">{{ topLevelItem.title }}</span>
          <p class="item-text">{{ topLevelItem.itemText }}</p>
        </template>
      </li>
    </ul>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue';
import axios from 'axios';

// --- Type Definitions ---

/** Represents a single task or section item in the todo list. */
interface TodoItem {
  id: string;
  type: 'SECTION' | 'TODO';
  title: string;
  complete: boolean; /* Relevant for TODO items */
  itemText: string; /* Relevant for TODO items */
}

/** Represents the entire todo list structure. */
interface TodoList {
  id: string;
  title: string;
  topLevelItems: TodoItem[];
}

// --- Props ---
interface Props {
  id: string;
}

const props = defineProps<Props>();

// --- Reactive State ---
const isEditing = ref<boolean>(false);
const tempTitle = ref<string>('');
const todoList = ref<TodoList | null>(null);

// --- Lifecycle Hooks ---
onMounted(() => {
  tempTitle.value = '';
  if (props.id) {
    // Fetch initial data using prop ID
    axios.get<TodoList>(`/api/todo-lists/${props.id}`)
      .then(response => {
        todoList.value = response.data;
      })
      .catch(error => {
        if (error instanceof Error){
          console.error('Error fetching todo list:', error);
        }
      });
  }
});

// --- Methods ---
const startEdit = () => {
  isEditing.value = true;
  if (todoList.value) {
    tempTitle.value = todoList.value.title;
  }
};

const saveTitle = async () => {
  if (!todoList.value) return;

  // Optimistically update the local state
  todoList.value.title = tempTitle.value;

  try {
    // Attempt to update the backend
    await axios.put<TodoList>(`/api/todo-lists/${props.id}`, todoList.value);

    // Re-fetch or explicitly update local state to ensure consistency after API call
    todoList.value = await axios.get<TodoList>(`/api/todo-lists/${props.id}`).then(r => r.data);

    isEditing.value = false;
  } catch (error) {
    console.error('Error saving todo list:', error);
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  // Reset temp title to the current state of the todoList title
  if (todoList.value) {
    tempTitle.value = todoList.value.title;
  }
};
</script>

<style scoped>
/* Added basic styling for readability and structure, following component pattern */
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
  /* Style for section headings */
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
</style>