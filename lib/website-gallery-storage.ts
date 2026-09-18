export interface StoredGalleryItem {
  id: string
  title: string
  date: string
  category: string
  caption: string
  src: string
  type: "photo" | "video"
  mimeType?: string
}

const DATABASE_NAME = "church-website-content"
const STORE_NAME = "gallery"
const ITEMS_KEY = "items"
const LEGACY_STORAGE_KEY = "church_website_gallery"

const openDatabase = () => new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open(DATABASE_NAME, 1)
  request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME)
  request.onsuccess = () => resolve(request.result)
  request.onerror = () => reject(request.error)
})

const readItems = (database: IDBDatabase) => new Promise<StoredGalleryItem[]>((resolve, reject) => {
  const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(ITEMS_KEY)
  request.onsuccess = () => resolve(Array.isArray(request.result) ? request.result : [])
  request.onerror = () => reject(request.error)
})

const writeItems = (database: IDBDatabase, items: StoredGalleryItem[]) => new Promise<void>((resolve, reject) => {
  const request = database.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(items, ITEMS_KEY)
  request.onsuccess = () => resolve()
  request.onerror = () => reject(request.error)
})

export const getStoredGallery = async (): Promise<StoredGalleryItem[] | null> => {
  if (typeof window === "undefined" || !("indexedDB" in window)) return null

  try {
    const database = await openDatabase()
    const items = await readItems(database)
    database.close()
    if (items.length) return items

    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (!legacy) return items
    const legacyItems = JSON.parse(legacy)
    if (!Array.isArray(legacyItems)) return items
    const normalizedItems = legacyItems.map((item) => ({ ...item, type: item.type ?? "photo" }))
    const migratedDatabase = await openDatabase()
    await writeItems(migratedDatabase, normalizedItems)
    migratedDatabase.close()
    return normalizedItems
  } catch {
    return null
  }
}

export const saveStoredGallery = async (items: StoredGalleryItem[]) => {
  const database = await openDatabase()
  await writeItems(database, items)
  database.close()
}
