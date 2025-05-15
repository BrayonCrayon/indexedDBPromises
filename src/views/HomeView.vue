<script setup lang="ts">
import {ref} from "vue";

const db = ref<IDBDatabase|null>(null);
const items = ref<{id: number, value: string}[]>([])
const itemStore = ref<IDBObjectStore>();

const item = ref<string>('')
const DBOpenRequest = window.indexedDB.open('promises')

DBOpenRequest.onerror = (event) => {
  console.log('Error opening DB')
};

DBOpenRequest.onsuccess = (event) => {
  console.log('Success opening DB')

  db.value = DBOpenRequest.result;

  // get items here
  itemStore.value = db.value.transaction(['items']).objectStore('items');
  const allItemsRequest = itemStore.value.getAll();
  allItemsRequest.onsuccess = (event) => {
    items.value = allItemsRequest.result
  }
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

const updateItem = (item: {id: number, value: string}) => {
  if (!db.value) return;

  const transaction = db.value.transaction(['items'], 'readwrite')

  transaction.oncomplete = () => {
    console.log('Transaction complete')
  };

  // new read write
  itemStore.value = transaction.objectStore('items');

  itemStore.value.put({value: item.value, id: item.id});
}

const deleteItem = (id: number) => {
  const transaction = db.value!.transaction(['items'], 'readwrite')
  transaction.objectStore('items').delete(id);
}
</script>

<template>
  <main>
    <input type="text" v-model="item" placeholder="Enter something" />
    <button type="button" @click="addItem">Add Item</button>

    <h3>Items in Database</h3>
    <div v-for="promisedItem in items" :key="promisedItem.id">
      <input type="text" v-model="promisedItem.value">
      <button @click="updateItem(promisedItem)"> update </button>
      <button @click="deleteItem(promisedItem.id)"> delete </button>
    </div>
  </main>
</template>
