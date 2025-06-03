<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Item} from "@/Types/Item.ts";
import {db} from "@/Types/IndexDBWrapper.ts";

const items = ref<Item[]>([])
const item = ref<string>('')
const indexDBWrapper = db()

const retrieveAllItems = async () => {
  try {
    const result = await indexDBWrapper.getAll();
    if (result.length > 0) {
      items.value = result;
    }
  }
  catch (error) {
    console.error(error);
  }
}

const openDb = async () => {
  try {
    const result = await indexDBWrapper.open('promises');
    await retrieveAllItems();
  }
  catch (error) {
    console.error(error);
  }
}
const addItem = async () => {
  try {
    const response = await indexDBWrapper.add({value: item.value});
    console.log(`Item added successfully! Id: ${response.id}, Value: ${response.value}`)
    item.value = "";
    await retrieveAllItems();
  }
  catch (error) {
    console.error(error);
  }
}

const updateItem = async (item: Item) => {
  try {
    const updatedItemId = await indexDBWrapper.update(item);
    console.log(`Item under id ${updatedItemId} was updated successfully`);
  }
  catch (error) {
    console.error(error);
  }
}

const deleteItem = async (id: number) => {
  try {
    const key = await indexDBWrapper.delete(id);
    console.log(id);
    console.log(`Item under id ${id} was deleted successfully`)
    await retrieveAllItems();
  }
  catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  await openDb();
})
</script>

<template>
  <main>
    <input id="add-input" type="text" v-model="item" placeholder="Enter something" />
    <button id="add-button" type="button" @click="addItem">Add Item</button>

    <h3>Items in Database</h3>
    <div v-for="promisedItem in items" :key="promisedItem.id">
      <input :id="`${promisedItem.id}-input`" type="text" v-model="promisedItem.value">
      <button @click="updateItem(promisedItem)"> update </button>
      <button @click="deleteItem(promisedItem.id)"> delete </button>
    </div>
  </main>
</template>
