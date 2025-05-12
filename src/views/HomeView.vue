<script setup lang="ts">
import {ref} from "vue";

const db = ref<IDBDatabase|null>(null);
const itemStore = ref<IDBObjectStore>();

const item = ref<string>('')
const DBOpenRequest = window.indexedDB.open('promises')

DBOpenRequest.onerror = (event) => {
  console.log('Error opening DB')
};

DBOpenRequest.onsuccess = (event) => {
  console.log('Success opening DB')

  db.value = DBOpenRequest.result;
};

DBOpenRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
  db.value = event.target!.result;

  db.value!.onerror = (event) => {
    console.log('Error loading database.');
  };

  itemStore.value = db.value!.createObjectStore('items', { keyPath: 'itemsTitle' });
  itemStore.value.createIndex('items', 'items', { unique: false });

  console.log('Object store created');
};

const addItem = () => {
  console.log('Item', item.value)
  itemStore.value!.add(item.value)
}
</script>

<template>
  <main>
    <input type="text" v-model="item" placeholder="Enter something" />
    <button type="button" @click="addItem">Add Item</button>
  </main>
</template>
