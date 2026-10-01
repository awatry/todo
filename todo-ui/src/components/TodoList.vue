<template>
  <div v-if="todoList">
    <div>
      <h1 v-if="!isEditing">{{ todoList.title }} - Component</h1>
      <h1 v-else>
        <input type="text" v-model="tempTitle" @keyup.enter="saveTitle" @blur="saveTitle" /> - Component
      </h1>
      <button v-if="!isEditing" @click="startEdit">Edit</button>
      <button v-else @click="saveTitle">Save</button>
      <button v-if="isEditing" @click="cancelEdit">Cancel</button>
    </div>
    <ul v-if="todoList.topLevelItems">
      <li v-for="topLevelItem in todoList.topLevelItems" :key="topLevelItem.id">
        <h3 v-if="topLevelItem.type === 'SECTION'">{{ topLevelItem.title }}</h3>
        <div v-else>
          <input type="checkbox" v-model="topLevelItem.complete">
          {{ topLevelItem.title }}
          <p>{{ topLevelItem.itemText }}</p>
        </div>
      </li>
    </ul>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isEditing: false,
      tempTitle: '',
      todoList: null
    }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.tempTitle = '';
    if (this.id) {
      axios.get(`/api/todo-lists/${this.id}`)
        .then(response => {
          this.todoList = response.data;
        })
        .catch(error => {
          console.error("Error fetching todo list:", error);
        });
    }
  },
  methods: {
    startEdit() {
      this.isEditing = true;
      this.tempTitle = this.todoList.title;
    },
    saveTitle() {
      if (this.todoList) {
        this.todoList.title = this.tempTitle;
        axios.put(`/api/todo-lists/${this.id}`, this.todoList)
          .then(response => {
            this.todoList = response.data;
            this.isEditing = false;
          })
          .catch(error => {
            console.error("Error saving todo list:", error);
          });
      }
    },
    cancelEdit() {
      this.isEditing = false;
    }
  }
}
</script>