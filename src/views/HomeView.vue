<script setup lang="ts">
import {ref} from "vue";

const item = ref<string>('')
const addItem = () => {
  console.log('Item', item.value)
}
</script>

<template>
  <main>
    <input type="text" v-model="item" placeholder="Enter something" />
    <button type="button" @click="addItem">Add Item</button>
  </main>
</template>
