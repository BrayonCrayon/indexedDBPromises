export class IndexDBWrapper {
  db: IDBDatabase|null = null

  open(name: string) {
    return new Promise((resolve, reject) => {
      const DBOpenRequest = window.indexedDB.open(name)

      DBOpenRequest.onerror = () => {
        reject(DBOpenRequest.result)
      };

      DBOpenRequest.onsuccess = () => {
        this.db = DBOpenRequest.result;
        resolve(DBOpenRequest.result)
      };

      DBOpenRequest.onupgradeneeded = () => {
        this.db = DBOpenRequest.result;
        this.db!.onerror = () => {
          reject(DBOpenRequest.result)
        };
        const itemStore = this.db!.createObjectStore('items', {keyPath: 'id', autoIncrement: true});

        itemStore.createIndex('items', 'items', {unique: false});

        resolve(DBOpenRequest.result);
      };
    });
  }

  add<T extends object>(item: T) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('No db found')
      }

      const transaction = this.db.transaction(['items'], 'readwrite')

      const itemStore = transaction.objectStore('items');

      const objectStoreRequest = itemStore.add({ ...item });

      objectStoreRequest.onsuccess = () => {
        resolve({id: objectStoreRequest.result, ...item});
      }

      objectStoreRequest.onerror = () => {
        reject(objectStoreRequest.result);
      }
    });
  }

  update<T extends object>(item: T) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('No db found')
      }

      const transaction = this.db.transaction(['items'], 'readwrite')

      const itemStore = transaction.objectStore('items');

      const objectStoreRequest = itemStore.put({ ...item });

      objectStoreRequest.onsuccess = () => {
        resolve(objectStoreRequest.result);
      }

      objectStoreRequest.onerror = () => {
        reject('Could not update the item.', objectStoreRequest.result);
      }
    })
  }

  delete(key: IDBValidKey|IDBKeyRange){
    if (!this.db) return;

    const transaction = this.db.transaction(['items'], 'readwrite')

    const objectStoreRequest = transaction.objectStore('items').delete(key);

    objectStoreRequest.onerror = () => {
      console.error('Could not delete the item.', objectStoreRequest.result);
    }
  }

  getAll<T>(): T[] {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('No db found')
      }

      const itemStore = this.db.transaction(['items']).objectStore('items');

      const allItemsRequest = itemStore.getAll();

      allItemsRequest.onsuccess = () => {
        resolve(allItemsRequest.result);
      }

      allItemsRequest.onerror = () => {
        reject(allItemsRequest.result)
      }
    });
  }
}
