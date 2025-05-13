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

  itemStore.value = db.value!.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
  itemStore.value.createIndex('items', 'items', { unique: false });
};

const addItem = () => {
  if (!db.value) return;

  const transaction = db.value.transaction(['items'], 'readwrite')

  transaction.oncomplete = () => {
    console.log('Transaction complete')
  };

  itemStore.value = transaction.objectStore('items');

  const objectStoreRequest = itemStore.value.add({ value: item.value });

  objectStoreRequest.onsuccess = (event) => {
    console.log('Success object store created', objectStoreRequest.result);
  }
}
</script>

<template>
  <main>
    <input type="text" v-model="item" placeholder="Enter something" />
    <button type="button" @click="addItem">Add Item</button>
  </main>
</template>
