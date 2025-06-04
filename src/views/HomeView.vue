<script setup lang="ts">
import {ref} from "vue";
import type {Item} from "@/Types/Item.ts";
import {IndexDBWrapper, db} from "@/Types/IndexDBWrapper.ts";

const items = ref<Item[]>([])
const item = ref<string>('')
const indexDBWrapper = db()
console.log("in component", indexDBWrapper)
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
      alert(`Item added successfully! Id: ${response.id}, Value: ${response.value}`)
      item.value = "";
      retrieveAllItems();
    })
    .catch((err) => {console.log(err)});
}

const updateItem = (item: Item) => {
  indexDBWrapper.update(item)
    .then((updatedItemId: number) => {
      alert(`Item under id ${updatedItemId} was updated successfully`)
    })
    .catch((err) => {console.log(err)});
}

const deleteItem = (id: number) => {
  indexDBWrapper.delete(id)
    .then(() => {
      console.log(id);
      alert(`Item under id ${id} was deleted successfully`)
      retrieveAllItems();
    })
    .catch((err) => {console.log(err)});
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
