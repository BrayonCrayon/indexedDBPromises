<script setup lang="ts">
import {ref} from "vue";
import type {Item} from "@/Types/Item.ts";
import {db} from "@/Types/IndexDBWrapper.ts";

const items = ref<Item[]>([])
const item = ref<string>('')
const indexDBWrapper = db()

indexDBWrapper.open('promises')
  .then(() => {retrieveAllItems()})
  .catch((err) => {console.log(err)})

const retrieveAllItems = () => {
  indexDBWrapper.getAll()
    .then((dbData: Item[]) => {
      items.value = dbData
    })
    .catch((err) => {console.log(err)});
}

const addItem = () => {
  indexDBWrapper.add({value: item.value})
    .then((response: Item) => {
      console.log(`Item added successfully! Id: ${response.id}, Value: ${response.value}`)
      item.value = "";
      retrieveAllItems();
    })
    .catch((err) => {console.log(err)});
}

const updateItem = (item: Item) => {
  indexDBWrapper.update(item)
    .then((updatedItemId: number) => {
      console.log(`Item under id ${updatedItemId} was updated successfully`)
    })
    .catch((err) => {console.log(err)});
}

const deleteItem = (id: number) => {
  indexDBWrapper.delete(id)
    .then(() => {
      console.log(id);
      console.log(`Item under id ${id} was deleted successfully`)
      retrieveAllItems();
    })
    .catch((err) => {console.log(err)});
}
</script>

<template>
  <main>
    <input id="add-input" type="text" v-model="item" placeholder="Enter something" />
    <button id="add-button" type="button" @click="addItem">Add Item</button>

    <h3>Items in Database</h3>
    <div v-for="promisedItem in items" :key="promisedItem.id">
      <input :id="`${promisedItem.id}-input`" type="text" v-model="promisedItem.value">
      <button id="update-button" @click="updateItem(promisedItem)"> update </button>
      <button id="delete-button" @click="deleteItem(promisedItem.id)"> delete </button>
    </div>
  </main>
</template>
