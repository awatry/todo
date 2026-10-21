import { createApp, defineComponent, type ComponentOptions } from 'vue';
import axios from 'axios';
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import TodoList from '@/components/TodoList.vue';

interface TodoListData {
  todoLists: any[];
}

interface TodoListMethods {
  updateData(data: any): void;
}

const routes: RouteRecordRaw[] = [
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

createApp(defineComponent({
  data(): TodoListData {
    return {
      todoLists: []
    };
  },
  methods: {
    updateData(data: any): void {
      console.log("New Data", data);
      (this as any).todoLists = data;
    }
  },
  mounted() {
    axios.get('/api/todo-lists')
      .then(response => {
        console.log("Got response", response.data);
        (this as any).updateData(response.data);
        //window.todoLists = this.todoLists;
      })
      .catch(error => {
        console.error(error);
      });
  },
  template: `
    <p>
      <strong class="font-bold">Current route path:</strong> {{ $route.fullPath }} <router-link :to="'/'">Go back</router-link>
    </p>
    <div v-for="todoList in todoLists" :key="todoList.id">
      {{ todoList.title }}
      <router-link :to="{ name: 'todoList', params: { id: todoList.id } }">View {{ todoList.title }}</router-link>
    </div>
    <main>
      <router-view />
    </main>
  `
})).use(router).mount('#app');
