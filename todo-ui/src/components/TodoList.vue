<template>
  <div>
    <h1>{{ todoList.title }} - Component</h1>
    <ul>
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
</template> 

<script>
export default {
  data() {
    return {
      todoList: {}
    }
  },
  props: {
    todoList: Object
  }
}
</script>