export interface LocalStorageInterface {
  // Method for updating the localstorage
  updateLocalStorage(storageId: any, value: any): void;

  // Method for retrieving from the localstorage
  getLocalStorage(storageId: any): string | null;

  // Method for removing an item from the localstorage
  removeFromLocalStorage(storageId: any): void;
}
