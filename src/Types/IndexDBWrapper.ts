export class IndexDBWrapper {
  db: IDBDatabase|null = null

  open(name: string) {
    const DBOpenRequest = window.indexedDB.open(name)

    DBOpenRequest.onerror = () => {
      console.log('Error opening DB')
    };

    DBOpenRequest.onsuccess = () => {
      console.log('Success opening DB')

      this.db = DBOpenRequest.result;

      // retrieveAllItems();
    };

    DBOpenRequest.onupgradeneeded = () => {
      this.db = DBOpenRequest.result;

      this.db!.onerror = () => {
        console.log('Error loading database.');
      };

      const itemStore = this.db!.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
      itemStore.createIndex('items', 'items', { unique: false });
    };
  }

  add<T>(item: T) {
    if (!this.db) return;

    const transaction = this.db.transaction(['items'], 'readwrite')

    // transaction.oncomplete = () => {
    //   item.value = "";
    // };

    const itemStore = transaction.objectStore('items');

    const objectStoreRequest = itemStore.add({ ...item });

    objectStoreRequest.onerror = () => {
      console.error('Could not create the item.', objectStoreRequest.result);
    }
    // retrieveAllItems();
  }

  update<T>(item: T) {
    if (!this.db) return;

    const transaction = this.db.transaction(['items'], 'readwrite')

    transaction.oncomplete = () => {
      console.log('Transaction complete')
    };

    const itemStore = transaction.objectStore('items');

    const objectStoreRequest = itemStore.put({ ...item });

    objectStoreRequest.onerror = () => {
      console.error('Could not update the item.', objectStoreRequest.result);
    }
  }

  delete<T>(key: T) {
    if (!this.db) return;

    const transaction = this.db.transaction(['items'], 'readwrite')

    const objectStoreRequest = transaction.objectStore('items').delete(key);

    objectStoreRequest.onerror = () => {
      console.error('Could not delete the item.', objectStoreRequest.result);
    }
    // retrieveAllItems();
  }
}
