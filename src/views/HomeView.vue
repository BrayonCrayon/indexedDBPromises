<script setup lang="ts">
import {ref} from "vue";
import type {Item} from "@/Types/Item.ts";

const db = ref<IDBDatabase|null>(null);
const items = ref<Item[]>([])

const item = ref<string>('')
const DBOpenRequest = window.indexedDB.open('promises')

DBOpenRequest.onerror = (event) => {
  console.log('Error opening DB')
};

DBOpenRequest.onsuccess = (event) => {
  console.log('Success opening DB')

  db.value = DBOpenRequest.result;

  retrieveAllItems();
};

DBOpenRequest.onupgradeneeded = () => {
  db.value = DBOpenRequest.result;

  db.value!.onerror = (event) => {
    console.log('Error loading database.');
  };

  const itemStore = db.value!.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
  itemStore.createIndex('items', 'items', { unique: false });
};

const retrieveAllItems = () => {
  const itemStore = db.value!.transaction(['items']).objectStore('items');

  const allItemsRequest = itemStore.getAll();

  allItemsRequest.onsuccess = (event) => {
    items.value = allItemsRequest.result
  }
}

const addItem = () => {
  if (!db.value) return;

  const transaction = db.value.transaction(['items'], 'readwrite')

  transaction.oncomplete = () => {
    item.value = "";
  };

  const itemStore = transaction.objectStore('items');

  const objectStoreRequest = itemStore.add({ value: item.value });

  objectStoreRequest.onerror = (event) => {
    console.error('Could not create the item.', objectStoreRequest.result);
  }
  retrieveAllItems();
}

const updateItem = (item: Item) => {
  if (!db.value) return;

  const transaction = db.value.transaction(['items'], 'readwrite')

  transaction.oncomplete = () => {
    console.log('Transaction complete')
  };

  // new read write
  const itemStore = transaction.objectStore('items');

  const objectStoreRequest = itemStore.put({value: item.value, id: item.id});

  objectStoreRequest.onerror = (event) => {
    console.error('Could not update the item.', objectStoreRequest.result);
  }
}

const deleteItem = (id: number) => {
  const transaction = db.value!.transaction(['items'], 'readwrite')

  const objectStoreRequest = transaction.objectStore('items').delete(id);

  objectStoreRequest.onerror = (event) => {
    console.error('Could not delete the item.', objectStoreRequest.result);
  }
  retrieveAllItems();
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
