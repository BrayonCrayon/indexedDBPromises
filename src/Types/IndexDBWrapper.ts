

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

  add<T extends object>(item: T) {
    if (!this.db) return;

    const transaction = this.db.transaction(['items'], 'readwrite')

    const itemStore = transaction.objectStore('items');

    const objectStoreRequest = itemStore.add({ ...item });

    objectStoreRequest.onerror = () => {
      console.error('Could not create the item.', objectStoreRequest.result);
    }
  }

  update<T extends object>(item: T) {
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

  delete(key: IDBValidKey|IDBKeyRange) {
    if (!this.db) return;

    const transaction = this.db.transaction(['items'], 'readwrite')

    const objectStoreRequest = transaction.objectStore('items').delete(key);

    objectStoreRequest.onerror = () => {
      console.error('Could not delete the item.', objectStoreRequest.result);
    }
  }

  getAll<T>(): T[] {
    if (!this.db) return [];

    const itemStore = this.db.transaction(['items']).objectStore('items');

    const allItemsRequest = itemStore.getAll();

    let items: T[] = []
    allItemsRequest.onsuccess = () => {
      items = allItemsRequest.result
    }

    return items;
  }
}
