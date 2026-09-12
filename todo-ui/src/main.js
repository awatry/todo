import { createApp } from 'vue';
import axios from 'axios';

createApp({
  data() {
    return {
      todoLists: []
    }
  },
  methods: {
    updateData(data) {
      console.log("New Data", data);
      this.todoLists = data;
    }
  },
  mounted() {
    console.log("HI! I'm starting.");
    axios.get('/api/todo-lists')
      .then(response => {
        console.log("Got response", response.data);
        this.updateData(response.data?._embedded?.todoListList);
        //window.todoLists = this.todoLists;
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
