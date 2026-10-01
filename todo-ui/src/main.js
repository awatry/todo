import { createApp } from 'vue';
import axios from 'axios';
import { createRouter, createWebHashHistory, RouterLink } from 'vue-router';
import TodoList from '@/components/TodoList.vue';

const routes = [
  {
    path: '/:id',
    name: 'todoList',
    component: TodoList,
    props: true
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

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
    <p>
      <strong>Current route path:</strong>{{ $route.fullPath }} <router-link :to="'/'">Go back</router-link>
    </p>
    <div v-for="todoList in todoLists" :key="todoList.id">
      {{ todoList.title }}
      <router-link :to="{ name: 'todoList', params: { id: todoList.id } }">View {{ todoList.title }}</router-link>
    </div>
    <main>
      <router-view />
    </main>
  `
}).use(router).mount('#app');
