// src/main.js
import { createApp } from 'vue';
import axios from 'axios';

createApp({
  data() {
    return {
      todoLists: []
    }
  },
  mounted() {
    axios.get('/api/todo-lists')
      .then(response => {
        this.todoLists = response.data;
      })
      .catch(error => {
        console.error(error);
      });
  },
  template: `
    <ol>
      <li v-for="todoList in todoLists" :key="todoList.id">
        {{ todoList.title }}
      </li>
    </ol>
  `
}).mount('#app');